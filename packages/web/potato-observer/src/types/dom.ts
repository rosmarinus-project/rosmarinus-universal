import type { Attribute } from '../const/attribute';

export interface ElementEx extends Element {
  [Attribute.ID]?: string;
}

export interface NodeEx extends Node {
  [Attribute.ID]?: string;
}
