export type Role = 'Admin' | 'Warden' | 'Student' | 'All';

export interface FolderNode {
  name: string;
  type: 'folder' | 'file';
  description: string;
  children?: FolderNode[];
  highlight?: boolean;
}

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
  ref?: string;
  default?: string;
  description: string;
  validation?: string;
}

export interface MongooseSchemaDef {
  collectionName: string;
  modelName: string;
  description: string;
  fields: SchemaField[];
  indexes: string[];
  codeSnippet: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  module: 'Auth' | 'Students' | 'Rooms' | 'Allocations' | 'Complaints' | 'Visitors' | 'Fees' | 'Analytics';
  roles: Role[];
  description: string;
  requestBody?: string;
  responseShape: string;
  queryParams?: string;
}

export interface ComponentNode {
  name: string;
  type: 'Page' | 'Layout' | 'Component' | 'Context' | 'Hook';
  description: string;
  children?: ComponentNode[];
}

export interface RouteDef {
  path: string;
  component: string;
  roles: Role[];
  layout: string;
  description: string;
}

export interface SecurityRule {
  category: string;
  title: string;
  description: string;
  implementation: string;
  icon: string;
}

export interface ValidationLayer {
  layer: string;
  tool: string;
  strategy: string;
  exampleSnippet: string;
}
