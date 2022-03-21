import { NS } from '@ns';
import { BatcherConfig } from 'config/batcher.config';
export async function main(ns : NS) : Promise<void> {
  let BC: BatcherConfig = new BatcherConfig();
  BC.batchtime;
  ns.tprint(BC.batchtime);
  
  BC.batchtime = 11;
  ns.tprint(BC.batchtime);
  
}