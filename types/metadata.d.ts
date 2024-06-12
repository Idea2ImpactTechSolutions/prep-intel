// types/metadata.d.ts
import { Metadata as NextMetadata } from 'next';

export interface Metadata extends NextMetadata {
  bodyClassName?: string;
}
