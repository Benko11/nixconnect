interface HashtagProps {
  name: string;
}

export default function Hashtag({ name }: HashtagProps) {
  return (
    <a href={`#${name}`} className="text-default-primary">
      #{name}
    </a>
  );
}
