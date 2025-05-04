import { useEffect, useState } from "react";
import { CodeBlock } from "./code-block";

interface LessonContentProps {
  content: {
    sections: Array<{
      type: string;
      content: string;
      language?: string; // For code blocks
      title?: string; // For headings
      items?: string[]; // For lists
    }>;
  };
}

export function LessonContent({ content }: LessonContentProps) {
  if (!content || !content.sections) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Không có nội dung cho bài học này</p>
      </div>
    );
  }

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {content.sections.map((section, index) => {
        switch (section.type) {
          case "heading":
            return (
              <h2 key={index} className="text-xl font-bold mt-6 mb-4">{section.title}</h2>
            );
          case "subheading":
            return (
              <h3 key={index} className="text-lg font-medium mt-4 mb-2">{section.title}</h3>
            );
          case "paragraph":
            return (
              <p key={index} className="mb-4">{section.content}</p>
            );
          case "code":
            return (
              <div key={index} className="my-4">
                <CodeBlock code={section.content} language={section.language || "typescript"} />
              </div>
            );
          case "image":
            return (
              <div key={index} className="my-6">
                <img 
                  src={section.content} 
                  alt={section.title || "Lesson image"} 
                  className="rounded-md w-full"
                />
                {section.title && (
                  <p className="text-sm text-center text-muted-foreground mt-2">{section.title}</p>
                )}
              </div>
            );
          case "list":
            return (
              <ul key={index} className="list-disc pl-6 mb-4 space-y-1">
                {section.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case "note":
            return (
              <div key={index} className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-4 my-4 rounded-r-md">
                <p className="text-blue-800 dark:text-blue-300">{section.content}</p>
              </div>
            );
          case "warning":
            return (
              <div key={index} className="bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500 p-4 my-4 rounded-r-md">
                <p className="text-amber-800 dark:text-amber-300">{section.content}</p>
              </div>
            );
          default:
            return <p key={index}>{section.content}</p>;
        }
      })}
    </div>
  );
}
