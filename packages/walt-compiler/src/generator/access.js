// @flow
import opcode from '../emitter/opcode';
import mergeBlock from './merge-block';
import type { GeneratorType } from './flow/types';
import mapSyntax from './map-syntax';

const generateAccess: GeneratorType = (node, parent) => {
  const [, field] = node.params;
  const block = node.params.map(mapSyntax(parent)).reduce(mergeBlock, []);
  // The sequence of opcodes to perfrom a memory load is
  // get(Local|Global) base, i32Const offset[, i32Const size, i32Mul ], i32Add
  block.push({ kind: opcode.i32Add, params: [] });

  block.push({
    kind: opcode[String(field.type) + 'Load'],
    params: [
      // Alignment
      2,
      // Memory. Always 0 in the WASM MVP
      0,
    ],
    debug: `access ${node.value} of type ${String(field.type)}`,
  });

  return block;
};

export default generateAccess;
