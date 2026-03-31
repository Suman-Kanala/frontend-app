import React from 'react';

interface JsonLdData {
  [key: string]: any;
}

interface JsonLdProps {
  data: JsonLdData;
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;
