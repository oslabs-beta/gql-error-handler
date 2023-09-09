export interface ASTNode {
  kind: string;
  children?: ASTNode[];
}

export interface ArgumentNode extends ASTNode {
  kind: 'Argument';
  name: NameNode;
  value: ValueNode;
}

export interface FieldNode extends ASTNode {
  kind: 'Field';
  name: NameNode;
  arguments?: ArgumentNode[];
  selectionSet?: SelectionSetNode;
}

export interface NameNode extends ASTNode {
  kind: 'Name';
  value: string;
}

export interface OperationDefinitionNode extends ASTNode {
  kind: 'OperationDefinition';
  operation: string;
  selectionSet: SelectionSetNode;
}

export interface SelectionSetNode extends ASTNode {
  kind: 'SelectionSet';
  selections: FieldNode[];
}

export interface StringValueNode extends ASTNode {
  kind: 'StringValue';
  value: string;
}

export interface ValueNode extends ASTNode {
  kind: string;
}

export interface QueryAST extends ASTNode {
  kind: 'Document';
  definitions: OperationDefinitionNode[];
}
