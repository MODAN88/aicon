import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContentGenerator } from '@/hooks/useContentGenerator';

export default function ContentGenerator() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('professional');
  const { generateContent, isLoading, error } = useContentGenerator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateContent(topic, style);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate New Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="topic">Topic</label>
            <Input
              id="topic"
              placeholder="Enter a topic for your blog post"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="style">Writing Style</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style">
                <SelectValue placeholder="Select a writing style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Content'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
