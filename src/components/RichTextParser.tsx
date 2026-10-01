import React from 'react';

export default function RichTextParser({ content }: { content: any }) {
  if (!content) return null;
  
  if (typeof content === 'string') return <p>{content}</p>;
  
  const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node) return null;
    
    if (node.type === 'text') {
      let text = node.text;
      let el = <span key={index}>{text}</span>;
      if (node.format & 1) el = <strong key={index}>{el}</strong>;
      if (node.format & 2) el = <em key={index}>{el}</em>;
      if (node.format & 8) el = <u key={index}>{el}</u>;
      return el;
    }
    
    if (node.type === 'paragraph') {
      return <p key={index} className="mb-4">{node.children?.map((c: any, i: number) => renderNode(c, i))}</p>;
    }
    
    if (node.type === 'heading') {
      const level = node.tag?.replace('h', '') || '2';
      const Tag = `h${level}` as any;
      return <Tag key={index} className="font-bold my-4 text-xl">{node.children?.map((c: any, i: number) => renderNode(c, i))}</Tag>;
    }
    
    if (node.type === 'list') {
      const Tag = node.listType === 'number' ? 'ol' : 'ul';
      const listClass = node.listType === 'number' ? 'list-decimal' : 'list-disc';
      return <Tag key={index} className={`${listClass} list-inside my-4 ml-4`}>{node.children?.map((c: any, i: number) => renderNode(c, i))}</Tag>;
    }
    
    if (node.type === 'listitem') {
      return <li key={index} className="mb-1">{node.children?.map((c: any, i: number) => renderNode(c, i))}</li>;
    }
    
    if (node.type === 'link') {
      return (
        <a 
          key={index} 
          href={node.fields?.url} 
          className="text-blue-600 hover:underline" 
          target={node.fields?.newTab ? '_blank' : undefined}
        >
          {node.children?.map((c: any, i: number) => renderNode(c, i))}
        </a>
      );
    }
    
    if (node.type === 'table') {
      return (
        <div key={index} className="overflow-x-auto my-4 border rounded-lg border-gray-200">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-200">
              {node.children?.map((c: any, i: number) => renderNode(c, i))}
            </tbody>
          </table>
        </div>
      );
    }

    if (node.type === 'tablerow') {
      return <tr key={index} className="hover:bg-gray-50 transition-colors">{node.children?.map((c: any, i: number) => renderNode(c, i))}</tr>;
    }

    if (node.type === 'tablecell') {
      // payload lexical table cell can be a header or normal cell
      if (node.headerState === 1 || node.headerState === 2 || node.headerState === 3) {
        return <th key={index} className="py-3 px-4 font-semibold text-gray-700 bg-gray-50/50">{node.children?.map((c: any, i: number) => renderNode(c, i))}</th>;
      }
      return <td key={index} className="py-3 px-4 text-black border-r border-gray-100 last:border-0">{node.children?.map((c: any, i: number) => renderNode(c, i))}</td>;
    }

    // root node or unknown block with children
    if (node.children) {
      return <div key={index}>{node.children.map((c: any, i: number) => renderNode(c, i))}</div>;
    }
    
    return null;
  };

  return <div className="rich-text-content">{content.root ? renderNode(content.root, 0) : renderNode(content, 0)}</div>;
}
