import React from 'react';

interface TextInputProps {
  id?: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: Boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false,
  onKeyPress,
}) => {
  return (
    <input
      id={id}
      name={name}
      value={value}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      onKeyPress={onKeyPress}
      required
      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
};

export default TextInput;