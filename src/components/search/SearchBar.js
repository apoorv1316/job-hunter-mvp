import Input from '../ui/Input';

export default function SearchBar({ value, onChange, placeholder = "Search by title, company, or keywords..." }) {
  return (
    <Input
      label="Search Jobs"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-lg"
    />
  );
}