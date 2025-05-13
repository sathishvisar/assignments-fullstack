import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { WordTokenizer, PorterStemmer } from 'natural';
import { LevenshteinDistance } from 'natural';
import User from './models/User';
import Conversation from './models/Conversation';
import Jobs from './models/Jobs';

// Initialize NLP components
const tokenizer = new WordTokenizer();
const stemmer = PorterStemmer;

// Enhanced keyword mappings with synonyms and related terms
const keywordMappings: Record<string, {keywords: string[], responseTemplate: string}> = {
  benefits: {
    keywords: ['benefit', 'perks', 'offer', 'advantages', 'what do i get', 'what\'s included'],
    responseTemplate: '🟢 **Benefits**: {value}'
  },
  salary: {
    keywords: ['salary', 'pay', 'compensation', 'income', 'how much', 'wage', 'earn'],
    responseTemplate: '🟢 **Salary**: {value}'
  },
  skills: {
    keywords: ['skills', 'technology', 'stack', 'what i need to know', 'requirements', 'qualifications', 'tech'],
    responseTemplate: '🟢 **Skills Required**: {value}'
  },
  location: {
    keywords: ['location', 'place', 'city', 'area', 'where is it', 'based', 'office'],
    responseTemplate: '🟢 **Location**: {value}'
  },
  remoteWorkPolicy: {
    keywords: ['remote', 'work from home', 'home', 'hybrid', 'wfh', 'flexible', 'telecommute'],
    responseTemplate: '🟢 **Remote Policy**: {value}'
  },
  relocation: {
    keywords: ['relocation', 'move', 'moving', 'relocate', 'transfer', 'new location'],
    responseTemplate: '🟢 **Relocation**: {value}'
  },
  visaSponsorship: {
    keywords: ['visa', 'sponsor', 'sponsorship', 'work permit', 'immigration', 'work visa'],
    responseTemplate: '🟢 **Visa Sponsorship**: {value}'
  },
  experience: {
    keywords: ['experience', 'years', 'qualifications', 'level', 'seniority', 'how much experience'],
    responseTemplate: '🟢 **Experience Required**: {value}'
  },
  description: {
    keywords: ['description', 'responsibilities', 'job', 'role', 'what will i do', 'duties'],
    responseTemplate: '🟢 **Job Description**: {value}'
  },
  hiringProcess: {
    keywords: ['process', 'steps', 'hiring', 'interview', 'recruitment', 'how to apply', 'stages'],
    responseTemplate: '🟢 **Hiring Process**: {value}'
  },
  company: {
    keywords: ['company', 'organization', 'firm', 'employer', 'who are you', 'about the company'],
    responseTemplate: '🟢 **About the Company**: {value}'
  },
  team: {
    keywords: ['team', 'who will i work with', 'department', 'colleagues', 'peers'],
    responseTemplate: '🟢 **Team**: {value}'
  }
};

// Enhanced response templates for common questions
const commonQuestionTemplates = [
  {
    pattern: /(how|what) (is|are) the (next )?steps?/i,
    response: "The typical hiring process involves: {hiringProcess}"
  },
  {
    pattern: /when (can|do) i (expect|hear) (back|response)/i,
    response: "The company usually responds within {responseTime}. You can expect to hear back after each stage of the process."
  },
  {
    pattern: /who (should|can) i contact/i,
    response: "For any questions, you can reach out to {contactPerson} at {contactEmail}."
  },
  {
    pattern: /what (is|are) the working hours/i,
    response: "The standard working hours are {workingHours}, but this may vary depending on team requirements."
  }
];

// Function to calculate similarity between two strings
const calculateSimilarity = (a: string, b: string): number => {
  return 1 - (LevenshteinDistance(a, b) / Math.max(a.length, b.length));
};

// Enhanced NLP processing
const processQuestion = (question: string, jobData: any): {responseParts: string[], matchedFields: string[]} => {
  const responseParts: string[] = [];
  const matchedFields: string[] = [];
  
  // Convert question to lowercase and tokenize
  const questionLower = question.toLowerCase();
  const questionTokens = tokenizer.tokenize(questionLower)?.map(word => stemmer.stem(word)) || [];
  
  // First check for common question patterns
  for (const template of commonQuestionTemplates) {
    if (template.pattern.test(questionLower)) {
      const field = template.response.match(/\{([^}]+)\}/)?.[1];
      if (field && jobData[field]) {
        const value = Array.isArray(jobData[field]) 
          ? jobData[field].join(', ')
          : jobData[field];
        responseParts.push(template.response.replace(`{${field}}`, value));
        matchedFields.push(field);
        return { responseParts, matchedFields };
      }
    }
  }
  
  // Then check for keyword matches
  for (const [field, config] of Object.entries(keywordMappings)) {
    // Check if question contains any of the keywords
    const hasKeyword = config.keywords.some(keyword => {
      const keywordStem = stemmer.stem(keyword);
      return questionTokens?.includes(keywordStem) || 
             questionLower.includes(keyword) ||
             calculateSimilarity(questionLower, keyword) > 0.7;
    });
    
    if (hasKeyword && jobData[field]) {
      let value = '';
      
      // Special handling for different field types
      if (field === 'salary' && jobData.salary) {
        value = `₹${jobData.salary.min} to ₹${jobData.salary.max} ${jobData.salary.currency}`;
      } 
      else if (field === 'remoteWorkPolicy') {
        const policy = jobData.remoteWorkPolicy.toLowerCase();
        if (policy.includes('remote')) {
          value = `Yes, this job allows remote work (${jobData.remoteWorkPolicy})`;
        } else if (policy.includes('hybrid')) {
          value = `This is a hybrid role — some remote work is allowed`;
        } else {
          value = `This role is not remote`;
        }
      }
      else if (field === 'relocation') {
        value = jobData.relocation 
          ? `The company offers relocation support` 
          : `No relocation assistance is provided`;
      }
      else if (field === 'visaSponsorship') {
        value = jobData.visaSponsorship.toLowerCase().includes('available')
          ? `Visa sponsorship is available for this role`
          : `Visa sponsorship is not available`;
      }
      else if (Array.isArray(jobData[field])) {
        value = jobData[field].join(', ');
      }
      else {
        value = jobData[field];
      }
      
      responseParts.push(config.responseTemplate.replace('{value}', value));
      matchedFields.push(field);
    }
  }
  
  return { responseParts, matchedFields };
};

// Generate fallback response when no direct matches
const generateFallbackResponse = (question: string, jobData: any): string => {
  // Try to find the most relevant field based on semantic similarity
  let bestMatch = { field: '', similarity: 0 };
  
  for (const [field, config] of Object.entries(keywordMappings)) {
    for (const keyword of config.keywords) {
      const similarity = calculateSimilarity(question.toLowerCase(), keyword);
      if (similarity > bestMatch.similarity) {
        bestMatch = { field, similarity };
      }
    }
  }
  
  if (bestMatch.similarity > 0.4 && jobData[bestMatch.field]) {
    const template = keywordMappings[bestMatch.field].responseTemplate;
    const value = Array.isArray(jobData[bestMatch.field]) 
      ? jobData[bestMatch.field].join(', ')
      : jobData[bestMatch.field];
    return `I think you're asking about ${bestMatch.field}. ` + 
           template.replace('{value}', value);
  }
  
  // If we still can't find a match, use a general response
  const generalResponses = [
    "Could you clarify your question about the job?",
    "I'm not sure I understand. Could you ask about a specific aspect of the job?",
    "Which part of the job are you interested in learning more about?",
    "I'd be happy to help! Could you provide more details about what you'd like to know?"
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

export const setupSocket = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return socket.disconnect(true);
    }

    try {
      // Verify token and extract user info
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const userId = decoded.id;

      // Find user in the database
      const user = await User.findById(userId);
      if (!user) {
        return socket.disconnect(true);
      }

      // Welcome message with context
      socket.on('init_chat', async (jobId: string) => {
        const job = await Jobs.findById(jobId).lean();
        const existingConversation = await Conversation.findOne({ userId, jobId });
        console.log('existingConversation.messages.length', existingConversation?.messages.length)
        if (existingConversation && existingConversation.messages.length > 0) {
          existingConversation.messages.forEach((msg) => {
            socket.emit('message', msg);
          });
        } else {
          const userName = user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : user?.email || 'Unknown User';
          const welcomeMessage = {
            role: 'assistant',
            content: `Hi ${userName}! I'm your assistant for the ${job?.title}` +
                    `You can ask me about the role, requirements, benefits, or anything else about this opportunity. ` +
                    `What would you like to know first?`,
            timestamp: new Date(),
            jobId,
            userId,
          };
      
          socket.emit('message', welcomeMessage);
          await Conversation.updateOne(
            { userId, jobId, messages: { $exists: true, $size: 0 } },
            { $push: { messages: welcomeMessage } },
            { upsert: true }
          );
        }
      });

      // Handle incoming messages with enhanced NLP
      socket.on('send_message', async (message: any) => {
        const { content, jobId } = message;
      
        if (!content || typeof content !== 'string') {
          return io.to(socket.id).emit('message', {
            role: 'assistant',
            content: 'Please enter a valid question about the job.',
            timestamp: new Date(),
            jobId,
            userId,
          });
        }
      
        // Save user message
        const userMessage = {
          role: 'user',
          content,
          timestamp: new Date(),
          jobId,
          userId,
        };

        await Conversation.findOneAndUpdate(
          { userId, jobId },
          { $push: { messages: userMessage } },
          { upsert: true, new: true }
        );
      
        io.to(socket.id).emit('message', userMessage);
      
        // Fetch job data
        const job = await Jobs.findById(jobId).lean();
        if (!job) {
          return io.to(socket.id).emit('message', {
            role: 'assistant',
            content: 'Sorry, I couldn\'t find the job details. Please try again later.',
            timestamp: new Date(),
            jobId,
            userId,
          });
        }
      
        // Process question with enhanced NLP
        const { responseParts, matchedFields } = processQuestion(content, job);
        
        let responseText: string;
        if (responseParts.length > 0) {
          responseText = responseParts.join('\n\n');
          
          // Add follow-up suggestions if we matched specific fields
          if (matchedFields.length > 0 && matchedFields.length < 3) {
            const suggestedQuestions = [
              'Would you like more details about any of these?',
              'Is there anything else you\'d like to know?',
              'Can I clarify anything for you?'
            ];
            responseText += `\n\n${suggestedQuestions[Math.floor(Math.random() * suggestedQuestions.length)]}`;
          }
        } else {
          responseText = generateFallbackResponse(content, job);
        }
      
        // Send response
        const responseMessage = {
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          jobId,
          userId,
        };
      
        io.to(socket.id).emit('message', responseMessage);
        await Conversation.findOneAndUpdate(
          { userId, jobId },
          { $push: { messages: responseMessage } },
          { upsert: true, new: true }
        );
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    } catch (err) {
      console.error('Error verifying token:', err);
      socket.disconnect(true);
    }
  });
};