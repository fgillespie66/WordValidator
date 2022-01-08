"use strict";

const BASE64_INT_TO_CHAR = `\
ABCDEFGHIJKLMNOPQRSTUVWXYZ\
abcdefghijklmnopqrstuvwxyz\
0123456789\
+/\
`.split("");

const BASE64_CHAR_TO_INT = BASE64_INT_TO_CHAR.reduce((agg, char, i) => {
  agg[char] = i;
  return agg;
}, {});

function readBits(binary, start, len) {
    const startChar = ~~(start / 6);
    const startBitOffset = start % 6;
    const endBit = startBitOffset + len;
    const charLen = Math.ceil(endBit / 6);
    const mask = (0x1 << len) - 1;
    let chunk = 0;
    for (let i = 0; i < charLen; i++) {
        chunk <<= 6;
        chunk |= BASE64_CHAR_TO_INT[binary[startChar + i]];
    }
    let rightPadding = endBit % 6;
    if (rightPadding) {
        chunk >>= (6 - rightPadding);
    }
    return chunk & mask;
}

const TERMINAL = "\0";
// const TERMINUS = Object.create(null);
const VERSION = 0;
const HEADER_WIDTH_FIELD = 10;
const VERSION_FIELD = 10;
const OFFSET_SIGN_FIELD = 1;
const OFFSET_VAL_FIELD = 21;
const CHAR_WIDTH_FIELD = 8;
const POINTER_WIDTH_FIELD = 8;

class PackedTrie {
    constructor(binary) {
        this.lastMask = 0x1;
        this.pointerShift = 1;
        let ptr = 0;
        const headerCharCount = readBits(binary, ptr,  HEADER_WIDTH_FIELD);
        ptr += HEADER_WIDTH_FIELD;
        const header = binary.substr(0, headerCharCount);
        const version = readBits(binary, ptr,  VERSION_FIELD);
        ptr +=  VERSION_FIELD;
        if (version !==  VERSION) {
            throw new Error(`Version mismatch! Binary: ${version}, Reader: ${ VERSION}`);
        }
        this.data = binary.substr(headerCharCount);
        const offsetSign = readBits(header, ptr,  OFFSET_SIGN_FIELD);
        ptr +=  OFFSET_SIGN_FIELD;
        let offset = readBits(header, ptr,  OFFSET_VAL_FIELD);
        ptr +=  OFFSET_VAL_FIELD;
        if (offsetSign) {
            offset = -offset;
        }
        this.offset = offset;
        let charWidth = readBits(header, ptr,  CHAR_WIDTH_FIELD);
        ptr +=  CHAR_WIDTH_FIELD;
        let pointerWidth = readBits(header, ptr,  POINTER_WIDTH_FIELD);
        ptr +=  POINTER_WIDTH_FIELD;
        let headerFieldChars = Math.ceil(ptr / 6);
        let charTable = header.substr(headerFieldChars);
        this.table = charTable.split('').reduce((agg, char, i) => {
            agg[char] = i + 1;
            return agg;
        }, { [ TERMINAL]: 0 });
        this.inverseTable = [ TERMINAL].concat(charTable.split(''));
        this.wordWidth = charWidth + pointerWidth + 1;
        this.pointerMask = (0x1 << pointerWidth) - 1;
        this.charMask = (0x1 << charWidth) - 1;
        this.charShift = 1 + pointerWidth;
    }
    test(str, { wildcard, prefix } = { wildcard: null, prefix: false }) {
        return this.search(str, { wildcard, prefix, first: true }) !== null;
    }
    search(str, { wildcard, prefix, first } = { wildcard: null, prefix: false, first: false }) {
        if (wildcard && wildcard.length !== 1) {
            throw new Error(`Wilcard must be a single character; got ${wildcard}`);
        }
        const { data, offset, table, inverseTable, wordWidth, lastMask, pointerShift, pointerMask, charShift, charMask } = this;
        const matches = [];
        const queue = [{ pointer: 0, memo: '', depth: 0 }];
        const lastDepth = str.length;
        while (queue.length) {
            const node = queue.shift();
            const isLast = node.depth >= lastDepth;
            const token = isLast ?  TERMINAL : str[node.depth];
            const isWild = token === wildcard || (prefix && isLast);
            let wordPointer = node.pointer;
            /* eslint-disable */
            while (true) {
                /* eslint-enable */
                if (!isWild && !table.hasOwnProperty(token)) {
                    break;
                }
                const bits = wordPointer * wordWidth;
                const chunk = readBits(data, bits, wordWidth);
                const charIdx = (chunk >> charShift) & charMask;
                if (isWild || charIdx === table[token]) {
                    const pointer = (chunk >> pointerShift) & pointerMask;
                    const newChar = inverseTable[charIdx];
                    if (isLast && newChar ===  TERMINAL) {
                        if (first) {
                            return node.memo;
                        }
                        matches.push(node.memo);
                        if (!isWild) {
                            break;
                        }
                    }
                    if (newChar !==  TERMINAL) {
                        queue.push({
                            pointer: wordPointer + offset + pointer,
                            depth: node.depth + 1,
                            memo: node.memo + newChar,
                        });
                    }
                }
                const last = chunk & lastMask;
                if (last) {
                    break;
                }
                else {
                    wordPointer += 1;
                }
            }
        }
        return first ? null : matches;
    }
}
//exports.PackedTrie = PackedTrie;
//# sourceMappingURL=PackedTrie.js.map
export { PackedTrie };