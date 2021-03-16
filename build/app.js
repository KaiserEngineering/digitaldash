import {randomBytes, createHash} from "crypto";
import http from "http";
import https from "https";
import zlib from "zlib";
import Stream, {PassThrough, pipeline} from "stream";
import util, {types} from "util";
import {format, parse, resolve, URLSearchParams as URLSearchParams$1} from "url";
import {parse as parse$1} from "cookie";
import {readFile, writeFile} from "fs/promises";
import jwt from "jsonwebtoken";
import "fs";
import {exec} from "child_process";
import pkg from "lodash";
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
const {Readable} = Stream;
const wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
class Blob {
  constructor(blobParts = [], options = {type: ""}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options.type === void 0 ? "" : String(options.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const {size} = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], {type});
    Object.assign(wm.get(blob), {size: span, parts: blobParts});
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
}
Object.defineProperties(Blob.prototype, {
  size: {enumerable: true},
  type: {enumerable: true},
  slice: {enumerable: true}
});
var fetchBlob = Blob;
class FetchBaseError extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
class FetchError extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
}
const NAME = Symbol.toStringTag;
const isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
const isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
const isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
const carriage = "\r\n";
const dashes = "-".repeat(2);
const carriageLength = Buffer.byteLength(carriage);
const getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
const getBoundary = () => randomBytes(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
const INTERNALS$2 = Symbol("Body internals");
class Body {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof Stream)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = Stream.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof Stream) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const {buffer, byteOffset, byteLength} = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new fetchBlob([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
}
Object.defineProperties(Body.prototype, {
  body: {enumerable: true},
  bodyUsed: {enumerable: true},
  arrayBuffer: {enumerable: true},
  blob: {enumerable: true},
  json: {enumerable: true},
  text: {enumerable: true}
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let {body} = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof Stream)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
const clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let {body} = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof Stream && typeof body.getBoundary !== "function") {
    p1 = new PassThrough({highWaterMark});
    p2 = new PassThrough({highWaterMark});
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
const extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof Stream) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
const getTotalBytes = (request) => {
  const {body} = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
const writeToStream = (dest, {body}) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
const validateHeaderName = typeof http.validateHeaderName === "function" ? http.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_HTTP_TOKEN"});
    throw err;
  }
};
const validateHeaderValue = typeof http.validateHeaderValue === "function" ? http.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_CHAR"});
    throw err;
  }
};
class Headers extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
}
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = {enumerable: true};
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch (e) {
      return false;
    }
  }));
}
const redirectStatus = new Set([301, 302, 303, 307, 308]);
const isRedirect = (code) => {
  return redirectStatus.has(code);
};
const INTERNALS$1 = Symbol("Response internals");
class Response extends Body {
  constructor(body = null, options = {}) {
    super(body, options);
    const status = options.status || 200;
    const headers = new Headers(options.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options.url,
      status,
      statusText: options.statusText || "",
      headers,
      counter: options.counter,
      highWaterMark: options.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
}
Object.defineProperties(Response.prototype, {
  url: {enumerable: true},
  status: {enumerable: true},
  ok: {enumerable: true},
  redirected: {enumerable: true},
  statusText: {enumerable: true},
  headers: {enumerable: true},
  clone: {enumerable: true}
});
const getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
};
const INTERNALS = Symbol("Request internals");
const isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
class Request extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return format(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
}
Object.defineProperties(Request.prototype, {
  method: {enumerable: true},
  url: {enumerable: true},
  headers: {enumerable: true},
  redirect: {enumerable: true},
  clone: {enumerable: true},
  signal: {enumerable: true}
});
const getNodeRequestOptions = (request) => {
  const {parsedURL} = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let {agent} = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
class AbortError extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
}
const supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch$1(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response(data, {headers: {"Content-Type": data.typeFull}});
      resolve2(response2);
      return;
    }
    const send = (options.protocol === "https:" ? https : http).request;
    const {signal} = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof Stream.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch$1(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = pipeline(response_, new PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: zlib.Z_SYNC_FLUSH,
        finishFlush: zlib.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = pipeline(body, zlib.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = pipeline(response_, new PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = pipeline(body, zlib.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = pipeline(body, zlib.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = pipeline(body, zlib.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
function noop$1() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
const subscriber_queue = [];
function writable(value, start = noop$1) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s = subscribers[i];
          s[1]();
          subscriber_queue.push(s, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return {set, update, subscribe: subscribe2};
}
function normalize(loaded) {
  if (loaded.error) {
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return {status: 500, error: error2};
    }
    return {status, error: error2};
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
async function get_response({request, options, $session, route, status = 200, error: error2}) {
  const host = options.host || request.headers[options.host_header];
  const dependencies = {};
  const serialized_session = try_serialize($session, (error3) => {
    throw new Error(`Failed to serialize session data: ${error3.message}`);
  });
  const serialized_data = [];
  const match = route && route.pattern.exec(request.path);
  const params = route && route.params(match);
  const page = {
    host,
    path: request.path,
    query: request.query,
    params
  };
  let uses_credentials = false;
  const fetcher = async (url, opts = {}) => {
    if (options.local && url.startsWith(options.paths.assets)) {
      url = url.replace(options.paths.assets, "");
    }
    const parsed = parse(url);
    if (opts.credentials !== "omit") {
      uses_credentials = true;
    }
    let response;
    if (parsed.protocol) {
      response = await fetch$1(parsed.href, opts);
    } else {
      const resolved = resolve(request.path, parsed.pathname);
      const filename = resolved.slice(1);
      const filename_html = `${filename}/index.html`;
      const asset = options.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
      if (asset) {
        if (options.get_static_file) {
          response = new Response(options.get_static_file(asset.file), {
            headers: {
              "content-type": asset.type
            }
          });
        } else {
          response = await fetch$1(`http://${page.host}/${asset.file}`, opts);
        }
      }
      if (!response) {
        const rendered2 = await ssr$1({
          host: request.host,
          method: opts.method || "GET",
          headers: opts.headers || {},
          path: resolved,
          body: opts.body,
          query: new URLSearchParams$1(parsed.query || "")
        }, {
          ...options,
          fetched: url
        });
        if (rendered2) {
          dependencies[resolved] = rendered2;
          response = new Response(rendered2.body, {
            status: rendered2.status,
            headers: rendered2.headers
          });
        }
      }
    }
    if (response) {
      const clone2 = response.clone();
      const headers2 = {};
      clone2.headers.forEach((value, key) => {
        if (key !== "etag")
          headers2[key] = value;
      });
      const payload = JSON.stringify({
        status: clone2.status,
        statusText: clone2.statusText,
        headers: headers2,
        body: await clone2.text()
      });
      serialized_data.push({url, payload});
      return response;
    }
    return new Response("Not found", {
      status: 404
    });
  };
  const parts = error2 ? [options.manifest.layout] : [options.manifest.layout, ...route.parts];
  const component_promises = parts.map((loader) => loader());
  const components2 = [];
  const props_promises = [];
  let context = {};
  let maxage;
  for (let i = 0; i < component_promises.length; i += 1) {
    let loaded;
    try {
      const mod = await component_promises[i];
      components2[i] = mod.default;
      if (options.only_prerender && !mod.prerender) {
        return;
      }
      if (mod.preload) {
        throw new Error("preload has been deprecated in favour of load. Please consult the documentation: https://kit.svelte.dev/docs#load");
      }
      loaded = mod.load && await mod.load.call(null, {
        page,
        get session() {
          uses_credentials = true;
          return $session;
        },
        fetch: fetcher,
        context: {...context}
      });
    } catch (e) {
      if (error2)
        throw e;
      loaded = {error: e, status: 500};
    }
    if (loaded) {
      loaded = normalize(loaded);
      if (loaded.error) {
        return await get_response({
          request,
          options,
          $session,
          route,
          status: loaded.status,
          error: loaded.error
        });
      }
      if (loaded.redirect) {
        return {
          status: loaded.status,
          headers: {
            location: loaded.redirect
          }
        };
      }
      if (loaded.context) {
        context = {
          ...context,
          ...loaded.context
        };
      }
      maxage = loaded.maxage || 0;
      props_promises[i] = loaded.props;
    }
  }
  const session2 = writable($session);
  let session_tracking_active = false;
  const unsubscribe = session2.subscribe(() => {
    if (session_tracking_active)
      uses_credentials = true;
  });
  session_tracking_active = true;
  if (error2) {
    if (options.dev) {
      error2.stack = await options.get_stack(error2);
    } else {
      error2.stack = String(error2);
    }
  }
  const props = {
    status,
    error: error2,
    stores: {
      page: writable(null),
      navigating: writable(null),
      session: session2
    },
    page,
    components: components2
  };
  for (let i = 0; i < props_promises.length; i += 1) {
    props[`props_${i}`] = await props_promises[i];
  }
  let rendered;
  try {
    rendered = options.root.render(props);
  } catch (e) {
    if (error2)
      throw e;
    return await get_response({
      request,
      options,
      $session,
      route,
      status: 500,
      error: e
    });
  }
  unsubscribe();
  const js_deps = route ? route.js : [];
  const css_deps = route ? route.css : [];
  const style = route ? route.style : "";
  const s = JSON.stringify;
  const prefix = `${options.paths.assets}/${options.app_dir}`;
  const links = options.amp ? `<style amp-custom>${style || (await Promise.all(css_deps.map((dep) => options.get_amp_css(dep)))).join("\n")}</style>` : [
    ...js_deps.map((dep) => `<link rel="modulepreload" href="${prefix}/${dep}">`),
    ...css_deps.map((dep) => `<link rel="stylesheet" href="${prefix}/${dep}">`)
  ].join("\n			");
  const init2 = options.amp ? `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"></script>` : `
		<script type="module">
			import { start } from ${s(options.entry)};
			${options.start_global ? `window.${options.start_global} = () => ` : ""}start({
				target: ${options.target ? `document.querySelector(${s(options.target)})` : "document.body"},
				host: ${host ? s(host) : "location.host"},
				paths: ${s(options.paths)},
				status: ${status},
				error: ${serialize_error(error2)},
				session: ${serialized_session}
			});
		</script>`;
  const head = [
    rendered.head,
    options.amp ? "" : `<style data-svelte>${style}</style>`,
    links,
    init2
  ].join("\n\n");
  const body = options.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({url, payload}) => `<script type="svelte-data" url="${url}">${payload}</script>`).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${uses_credentials ? "private" : "public"}, max-age=${maxage}`;
  }
  return {
    status,
    headers,
    body: options.template({head, body}),
    dependencies
  };
}
async function render_page(request, context, options) {
  const route = options.manifest.pages.find((route2) => route2.pattern.test(request.path));
  const $session = await (options.setup.getSession && options.setup.getSession({context}));
  if (!route) {
    if (options.fetched) {
      throw new Error(`Bad request in load function: failed to fetch ${options.fetched}`);
    }
    return await get_response({
      request,
      options,
      $session,
      route,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
  return await get_response({
    request,
    options,
    $session,
    route,
    status: 200,
    error: null
  });
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const {name, message, stack} = error2;
    serialized = try_serialize({name, message, stack});
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function render_route(request, context, options) {
  const route = options.manifest.endpoints.find((route2) => route2.pattern.test(request.path));
  if (!route)
    return null;
  return route.load().then(async (mod) => {
    const handler = mod[request.method.toLowerCase().replace("delete", "del")];
    if (handler) {
      const match = route.pattern.exec(request.path);
      const params = route.params(match);
      const response = await handler({
        host: options.host || request.headers[options.host_header || "host"],
        path: request.path,
        headers: request.headers,
        query: request.query,
        body: request.body,
        params
      }, context);
      if (typeof response !== "object" || response.body == null) {
        return {
          status: 500,
          body: `Invalid response from route ${request.path}; ${response.body == null ? "body is missing" : `expected an object, got ${typeof response}`}`,
          headers: {}
        };
      }
      let {status = 200, body, headers = {}} = response;
      headers = lowercase_keys(headers);
      if (typeof body === "object" && !("content-type" in headers) || headers["content-type"] === "application/json") {
        headers = {...headers, "content-type": "application/json"};
        body = JSON.stringify(body);
      }
      return {status, body, headers};
    } else {
      return {
        status: 501,
        body: `${request.method} is not implemented for ${request.path}`,
        headers: {}
      };
    }
  });
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function md5(body) {
  return createHash("md5").update(body).digest("hex");
}
async function ssr$1(request, options) {
  if (request.path.endsWith("/") && request.path !== "/") {
    const q = request.query.toString();
    return {
      status: 301,
      headers: {
        location: request.path.slice(0, -1) + (q ? `?${q}` : "")
      }
    };
  }
  const {context, headers = {}} = await (options.setup.prepare && options.setup.prepare({headers: request.headers})) || {};
  try {
    const response = await (render_route(request, context, options) || render_page(request, context, options));
    if (response) {
      if (response.status === 200) {
        if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
          const etag = `"${md5(response.body)}"`;
          if (request.headers["if-none-match"] === etag) {
            return {
              status: 304,
              headers: {},
              body: null
            };
          }
          response.headers["etag"] = etag;
        }
      }
      return {
        status: response.status,
        headers: {...headers, ...response.headers},
        body: response.body,
        dependencies: response.dependencies
      };
    }
  } catch (e) {
    if (e && e.stack) {
      e.stack = await options.get_stack(e);
    }
    console.error(e && e.stack || e);
    return {
      status: 500,
      headers,
      body: options.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_store_value(store, ret, value = ret) {
  store.set(value);
  return ret;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
const escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({$$});
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, options = {}) => {
      on_destroy = [];
      const result = {title: "", head: "", css: new Set()};
      const html = $$render(result, props, {}, options);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
const $error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {status} = $$props;
  let {error: error2} = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<main><h1>${escape(status)}</h1>
  <p>Something went wrong!</p>
  <pre>${escape(error2.stack)}</pre></main>`;
});
var $error$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: $error
});
var root_svelte = "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}";
const css$5 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\timport ErrorComponent from \\"../../../src/routes/$error.svelte\\";\\n\\n\\t// error handling\\n\\texport let status = undefined;\\n\\texport let error = undefined;\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\n\\tconst Layout = components[0];\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title;\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n</script>\\n\\n<Layout {...(props_0 || {})}>\\n\\t{#if error}\\n\\t\\t<ErrorComponent {status} {error}/>\\n\\t{:else}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}/>\\n\\t{/if}\\n</Layout>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\tNavigated to {title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AA0DC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {status = void 0} = $$props;
  let {error: error2 = void 0} = $$props;
  let {stores} = $$props;
  let {page} = $$props;
  let {components: components2} = $$props;
  let {props_0 = null} = $$props;
  let {props_1 = null} = $$props;
  const Layout = components2[0];
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title;
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components2 !== void 0)
    $$bindings.components(components2);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  $$result.css.add(css$5);
  {
    stores.page.set(page);
  }
  return `


${validate_component(Layout, "Layout").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${error2 ? `${validate_component($error, "ErrorComponent").$$render($$result, {status, error: error2}, {}, {})}` : `${validate_component(components2[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-1j55zn5"}">${navigated ? `Navigated to ${escape(title)}` : ``}</div>` : ``}`;
});
let sessionCache;
let credentialsCache;
async function get_user(sid) {
  if (sessionCache) {
    return sessionCache;
  } else {
    return await readFile("auth.json", "utf8").then((result) => {
      let authObj = JSON.parse(result);
      if (!authObj || !authObj.Session) {
        console.log("No session found on file.");
        return void 0;
      } else {
        return authObj.Session.token && authObj.Session.token == sid ? authObj.User : void 0;
      }
    }).catch(function(error2) {
      console.error(error2);
      return void 0;
    });
  }
}
async function get$1() {
  if (credentialsCache) {
    return credentialsCache;
  } else {
    return await readFile("auth.json", "utf8").then((result) => {
      credentialsCache = JSON.parse(result).User;
      return credentialsCache;
    }).catch(function(error2) {
      console.error(error2);
      return {};
    });
  }
}
async function post$1(request) {
  return await readFile("auth.json", "utf8").then((result) => {
    let credentials = JSON.parse(result).User;
    let attempt = JSON.parse(request.body);
    let res = {
      message: "Login failed",
      ret: 0,
      username: ""
    };
    let headers = {};
    if (credentials.Username.toLowerCase() == attempt.Username.toLowerCase() && credentials.Password == attempt.Password) {
      res.ret = 1;
      res.message = "Success";
      res.username = attempt.Username;
      let token = jwt.sign(credentials, "ke-webapp");
      headers = {
        "Set-Cookie": "ke_web_app=" + token + "; Path=/; SameSite=Strict; Expires='';"
      };
      updateSession({...credentials, token});
      updateSessionCache({...credentials, token});
    }
    return {
      headers,
      body: res
    };
  }).catch(function(error2) {
    console.error(error2);
    return {};
  });
}
async function put$1(request) {
  let args = JSON.parse(request.body);
  let temp = {Session: {...args.Session}, User: {Username: args.username, Password: args.password}};
  return await writeFile("auth.json", JSON.stringify(temp, null, 2)).then(() => {
    credentialsCache = temp.User;
    return {body: {ret: 1, message: "Login updated"}};
  }).catch(function(error2) {
    console.error(error2);
    return {body: {ret: 0, message: "Failed to update login"}};
  });
}
async function updateSession(credentials) {
  let content = {
    User: {
      Username: credentials.Username,
      Password: credentials.Password
    },
    Session: {
      token: credentials.token
    }
  };
  writeFile("auth.json", JSON.stringify(content, null, 2));
}
function updateSessionCache(credentials) {
  sessionCache = {
    User: {
      Username: credentials.Username,
      Password: credentials.Password
    },
    Session: {
      token: credentials.Username
    }
  };
}
var user = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get_user,
  get: get$1,
  post: post$1,
  put: put$1,
  updateSessionCache
});
const env$1 = process.env;
const config_path = env$1.KEGUIHome;
async function readConfigAsync() {
  return await readFile(config_path + "/etc/config.json", "utf8").then((result) => {
    let json = JSON.parse(result);
    return json;
  }).catch(function(error2) {
    return void 0;
  });
}
let configCache;
async function get() {
  if (configCache) {
    return configCache;
  } else {
    return await readFile(`${config_path}/etc/config.json`, "utf8").then((result) => {
      configCache = JSON.parse(result);
      return configCache;
    }).catch(function(error2) {
      return {};
    });
  }
}
async function post(request) {
  const newConfig = JSON.parse(request.body);
  return await writeFile(`${config_path}/etc/config.json`, JSON.stringify(newConfig, null, 2)).then(() => {
    configCache = readConfigAsync();
    return {body: {ret: 1, message: "Config updated", config: configCache}};
  }).catch(function(error2) {
    return {body: {ret: 0, message: "Config failed to update: " + error2, config: configCache}};
  });
}
async function put(request) {
  const id = request.body.id;
  let temp = configCache;
  if (!temp) {
    temp = await readConfigAsync();
  }
  temp.views[id].enabled = temp.views[id].enabled ? false : true;
  let count = 0;
  for (var key in temp.views) {
    if (temp.views[key].enabled) {
      count = 1;
      break;
    }
  }
  if (count === 0) {
    temp.views[id].enabled = temp.views[id].enabled ? false : true;
    return {body: {ret: 0, views: temp, message: "Need at least one enabled view"}};
  } else {
    return await writeFile(`${config_path}/etc/config.json`, JSON.stringify(temp, null, 2)).then(() => {
      configCache = readConfigAsync();
      return {body: {ret: 1, views: temp, message: "Config updated"}};
    }).catch(function(error2) {
      return {body: {ret: 0, message: "Config failed to update: ", error: error2, views: temp}};
    });
  }
}
var config = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get,
  post,
  put
});
const execute = util.promisify(exec);
const env = process.env;
const constants_path = env.KEGUIHome;
let constantsCache;
async function getConstants() {
  if (constantsCache) {
    return constantsCache;
  } else {
    const {stdout, stderr} = await execute(`python3 ${constants_path}/static/constants.py`);
    if (stderr) {
      console.error("Could not read constants.py");
      return {};
    } else {
      constantsCache = JSON.parse(stdout);
      return constantsCache;
    }
  }
}
var constants = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  getConstants
});
async function prepare({headers}) {
  let cookies;
  if (headers.cookie) {
    cookies = parse$1(headers.cookie);
  }
  const user2 = headers.cookie ? await get_user(cookies["ke_web_app"]) : void 0;
  return {
    context: {
      user: user2,
      configuration: await get(),
      constants: await getConstants()
    }
  };
}
async function getSession(context) {
  context = context.context;
  return {
    user: context.user && context.user && {
      username: context.user.Username
    },
    actions: [],
    configuration: context.configuration,
    constants: context.constants,
    count: 0
  };
}
var setup = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  prepare,
  getSession
});
const template = ({head, body}) => '<!DOCTYPE html>\n<html lang="en" class="h-100">\n  <head>\n    <meta charset="utf-8" />\n    <link rel="icon" href="/favicon.ico" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    ' + head + `

    <link rel='stylesheet' href='/css/bootstrap.min.css'>
    <link rel='stylesheet' href='/css/floating-labels.css'>

  </head>
  <body id="svelte" class="d-flex flex-column">
    ` + body + "\n  </body>\n  <script defer src='/js/bootstrap.min.js'></script>\n</html>\n";
function init({paths}) {
}
const d = decodeURIComponent;
const empty = () => ({});
const components = [
  () => Promise.resolve().then(function() {
    return index;
  }),
  () => Promise.resolve().then(function() {
    return advanced;
  }),
  () => Promise.resolve().then(function() {
    return settings;
  }),
  () => Promise.resolve().then(function() {
    return login;
  }),
  () => Promise.resolve().then(function() {
    return _slug_;
  })
];
const manifest = {
  assets: [{file: "css/bootstrap.min.css", size: 153402, type: "text/css"}, {file: "css/floating-labels.css", size: 1712, type: "text/css"}, {file: "css/ke.css", size: 151, type: "text/css"}, {file: "favicon.ico", size: 15406, type: "image/vnd.microsoft.icon"}, {file: "images/Alerts/FordWarning.png", size: 2315, type: "image/png"}, {file: "images/Alerts/gauge.png", size: 2315, type: "image/png"}, {file: "images/Alerts/warningBlock.png", size: 7013, type: "image/png"}, {file: "images/Background/BlackBackground.png", size: 3868, type: "image/png"}, {file: "images/Background/CarbonFiber.png", size: 223442, type: "image/png"}, {file: "images/Background/alignment.png", size: 9103, type: "image/png"}, {file: "images/Background/banner1.jpg", size: 18600, type: "image/jpeg"}, {file: "images/Background/bg.jpg", size: 58523, type: "image/jpeg"}, {file: "images/Background/green.jpg", size: 95095, type: "image/jpeg"}, {file: "images/Clock/Gauge.png", size: 56425, type: "image/png"}, {file: "images/Dirt/gauge.png", size: 20032, type: "image/png"}, {file: "images/Dirt/needle.png", size: 24328, type: "image/png"}, {file: "images/Glow/gauge.png", size: 46894, type: "image/png"}, {file: "images/Glow/needle.png", size: 1691, type: "image/png"}, {file: "images/Linear/gauge.png", size: 645, type: "image/png"}, {file: "images/Stock/gauge.png", size: 49334, type: "image/png"}, {file: "images/Stock/needle.png", size: 12646, type: "image/png"}, {file: "images/StockRS/gauge.png", size: 51697, type: "image/png"}, {file: "images/StockRS/needle.png", size: 10993, type: "image/png"}, {file: "images/Stock_orange/gauge.png", size: 17507, type: "image/png"}, {file: "images/Stock_orange/needle.png", size: 12646, type: "image/png"}, {file: "images/logo.png", size: 14975, type: "image/png"}, {file: "js/bootstrap.bundle.js", size: 246809, type: "application/javascript"}, {file: "js/bootstrap.bundle.js.map", size: 438468, type: "application/json"}, {file: "js/bootstrap.bundle.min.js", size: 80217, type: "application/javascript"}, {file: "js/bootstrap.bundle.min.js.map", size: 315920, type: "application/json"}, {file: "js/bootstrap.esm.js", size: 144926, type: "application/javascript"}, {file: "js/bootstrap.esm.js.map", size: 282055, type: "application/json"}, {file: "js/bootstrap.esm.min.js", size: 79148, type: "application/javascript"}, {file: "js/bootstrap.esm.min.js.map", size: 221500, type: "application/json"}, {file: "js/bootstrap.js", size: 153916, type: "application/javascript"}, {file: "js/bootstrap.js.map", size: 283267, type: "application/json"}, {file: "js/bootstrap.min.css.map", size: 588906, type: "application/json"}, {file: "js/bootstrap.min.js", size: 63450, type: "application/javascript"}, {file: "js/bootstrap.min.js.map", size: 214935, type: "application/json"}, {file: "robots.txt", size: 67, type: "text/plain"}],
  layout: () => Promise.resolve().then(function() {
    return $layout$1;
  }),
  error: () => Promise.resolve().then(function() {
    return $error$1;
  }),
  pages: [
    {
      pattern: /^\/$/,
      params: empty,
      parts: [components[0]],
      css: ["assets/start-dbd11ffd.css", "assets/pages/index.svelte-42fcf5f8.css", "assets/Slider-ae22a239.css"],
      js: ["start-92340a14.js", "chunks/stores-dbc60e4c.js", "chunks/singletons-dd9f995d.js", "pages/index.svelte-f4498729.js", "chunks/Slider-b4cf688f.js"]
    },
    {
      pattern: /^\/advanced\/?$/,
      params: empty,
      parts: [components[1]],
      css: ["assets/start-dbd11ffd.css", "assets/pages/advanced.svelte-be6f3cc0.css"],
      js: ["start-92340a14.js", "chunks/stores-dbc60e4c.js", "chunks/singletons-dd9f995d.js", "pages/advanced.svelte-03b75e45.js"]
    },
    {
      pattern: /^\/settings\/?$/,
      params: empty,
      parts: [components[2]],
      css: ["assets/start-dbd11ffd.css"],
      js: ["start-92340a14.js", "chunks/stores-dbc60e4c.js", "chunks/singletons-dd9f995d.js", "pages/settings.svelte-1e3af1ce.js"]
    },
    {
      pattern: /^\/login\/?$/,
      params: empty,
      parts: [components[3]],
      css: ["assets/start-dbd11ffd.css"],
      js: ["start-92340a14.js", "chunks/stores-dbc60e4c.js", "chunks/singletons-dd9f995d.js", "pages/login.svelte-6a2e6eb4.js"]
    },
    {
      pattern: /^\/edit\/([^/]+?)\/?$/,
      params: (m) => ({slug: d(m[1])}),
      parts: [components[4]],
      css: ["assets/start-dbd11ffd.css", "assets/pages/edit/[slug].svelte-cf839993.css", "assets/Slider-ae22a239.css"],
      js: ["start-92340a14.js", "chunks/stores-dbc60e4c.js", "chunks/singletons-dd9f995d.js", "pages/edit/[slug].svelte-3018a69b.js", "chunks/Slider-b4cf688f.js"]
    }
  ],
  endpoints: [
    {pattern: /^\/api\/constants\/?$/, params: empty, load: () => Promise.resolve().then(function() {
      return constants;
    })},
    {pattern: /^\/api\/config\/?$/, params: empty, load: () => Promise.resolve().then(function() {
      return config;
    })},
    {pattern: /^\/api\/user\/?$/, params: empty, load: () => Promise.resolve().then(function() {
      return user;
    })}
  ]
};
function render(request, {
  paths = {base: "", assets: "/."},
  local = false,
  only_prerender = false,
  get_static_file
} = {}) {
  return ssr$1(request, {
    paths,
    local,
    template,
    manifest,
    target: "#svelte",
    entry: "/./_app/start-92340a14.js",
    root: Root,
    setup,
    dev: false,
    amp: false,
    only_prerender,
    app_dir: "_app",
    host: null,
    host_header: null,
    get_stack: (error2) => error2.stack,
    get_static_file,
    get_amp_css: (dep) => amp_css_lookup[dep]
  });
}
const ssr = typeof window === "undefined";
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
const error = (verb) => {
  throw new Error(ssr ? `Can only ${verb} session store in browser` : `Cannot ${verb} session store before subscribing`);
};
const session = {
  subscribe(fn) {
    const store = getStores().session;
    if (!ssr) {
      session.set = store.set;
      session.update = store.update;
    }
    return store.subscribe(fn);
  },
  set: (value) => {
    error("set");
  },
  update: (updater) => {
    error("update");
  }
};
var Slider_svelte = '.switch.svelte-1wgc2n4.svelte-1wgc2n4{position:relative;display:inline-block;width:60px;height:34px}.switch.svelte-1wgc2n4 input.svelte-1wgc2n4{opacity:0;width:0;height:0}.slider.svelte-1wgc2n4.svelte-1wgc2n4{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.slider.svelte-1wgc2n4.svelte-1wgc2n4:before{position:absolute;content:"";height:26px;width:26px;left:4px;bottom:4px;background-color:white;-webkit-transition:.4s;transition:.4s}input.svelte-1wgc2n4:checked+.slider.svelte-1wgc2n4{background-color:#FF4D4D}input.svelte-1wgc2n4:focus+.slider.svelte-1wgc2n4{box-shadow:0 0 1px #FF4D4D}input.svelte-1wgc2n4:checked+.slider.svelte-1wgc2n4:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translateX(26px)}.slider.round.svelte-1wgc2n4.svelte-1wgc2n4{border-radius:34px}.slider.round.svelte-1wgc2n4.svelte-1wgc2n4:before{border-radius:50%}';
const css$4 = {
  code: '.switch.svelte-1wgc2n4.svelte-1wgc2n4{position:relative;display:inline-block;width:60px;height:34px}.switch.svelte-1wgc2n4 input.svelte-1wgc2n4{opacity:0;width:0;height:0}.slider.svelte-1wgc2n4.svelte-1wgc2n4{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.slider.svelte-1wgc2n4.svelte-1wgc2n4:before{position:absolute;content:"";height:26px;width:26px;left:4px;bottom:4px;background-color:white;-webkit-transition:.4s;transition:.4s}input.svelte-1wgc2n4:checked+.slider.svelte-1wgc2n4{background-color:#FF4D4D}input.svelte-1wgc2n4:focus+.slider.svelte-1wgc2n4{box-shadow:0 0 1px #FF4D4D}input.svelte-1wgc2n4:checked+.slider.svelte-1wgc2n4:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translateX(26px)}.slider.round.svelte-1wgc2n4.svelte-1wgc2n4{border-radius:34px}.slider.round.svelte-1wgc2n4.svelte-1wgc2n4:before{border-radius:50%}',
  map: '{"version":3,"file":"Slider.svelte","sources":["Slider.svelte"],"sourcesContent":["<script>\\n  export let callback;\\n  export let checked;\\n  export let callbackArgs;\\n</script>\\n\\n<label class=\\"switch\\">\\n  <input on:click=\\"{() => {callback(callbackArgs)}}\\" bind:checked={checked} type=\\"checkbox\\">\\n  <span class=\\"slider round\\"></span>\\n</label>\\n\\n<style>\\n  .switch {\\n    position: relative;\\n    display: inline-block;\\n    width: 60px;\\n    height: 34px;\\n  }\\n\\n  /* Hide default HTML checkbox */\\n  .switch input {\\n    opacity: 0;\\n    width: 0;\\n    height: 0;\\n  }\\n\\n  /* The slider */\\n  .slider {\\n    position: absolute;\\n    cursor: pointer;\\n    top: 0;\\n    left: 0;\\n    right: 0;\\n    bottom: 0;\\n    background-color: #ccc;\\n    -webkit-transition: .4s;\\n    transition: .4s;\\n  }\\n\\n  .slider:before {\\n    position: absolute;\\n    content: \\"\\";\\n    height: 26px;\\n    width: 26px;\\n    left: 4px;\\n    bottom: 4px;\\n    background-color: white;\\n    -webkit-transition: .4s;\\n    transition: .4s;\\n  }\\n\\n  input:checked + .slider {\\n    background-color: #FF4D4D;\\n  }\\n\\n  input:focus + .slider {\\n    box-shadow: 0 0 1px #FF4D4D;\\n  }\\n\\n  input:checked + .slider:before {\\n    -webkit-transform: translateX(26px);\\n    -ms-transform: translateX(26px);\\n    transform: translateX(26px);\\n  }\\n\\n  /* Rounded sliders */\\n  .slider.round {\\n    border-radius: 34px;\\n  }\\n\\n  .slider.round:before {\\n    border-radius: 50%;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAYE,OAAO,8BAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,YAAY,CACrB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AACd,CAAC,AAGD,sBAAO,CAAC,KAAK,eAAC,CAAC,AACb,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,AACX,CAAC,AAGD,OAAO,8BAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,OAAO,CACf,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,CACT,gBAAgB,CAAE,IAAI,CACtB,kBAAkB,CAAE,GAAG,CACvB,UAAU,CAAE,GAAG,AACjB,CAAC,AAED,qCAAO,OAAO,AAAC,CAAC,AACd,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,EAAE,CACX,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,IAAI,CAAE,GAAG,CACT,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,KAAK,CACvB,kBAAkB,CAAE,GAAG,CACvB,UAAU,CAAE,GAAG,AACjB,CAAC,AAED,oBAAK,QAAQ,CAAG,OAAO,eAAC,CAAC,AACvB,gBAAgB,CAAE,OAAO,AAC3B,CAAC,AAED,oBAAK,MAAM,CAAG,OAAO,eAAC,CAAC,AACrB,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,OAAO,AAC7B,CAAC,AAED,oBAAK,QAAQ,CAAG,sBAAO,OAAO,AAAC,CAAC,AAC9B,iBAAiB,CAAE,WAAW,IAAI,CAAC,CACnC,aAAa,CAAE,WAAW,IAAI,CAAC,CAC/B,SAAS,CAAE,WAAW,IAAI,CAAC,AAC7B,CAAC,AAGD,OAAO,MAAM,8BAAC,CAAC,AACb,aAAa,CAAE,IAAI,AACrB,CAAC,AAED,OAAO,oCAAM,OAAO,AAAC,CAAC,AACpB,aAAa,CAAE,GAAG,AACpB,CAAC"}'
};
const Slider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {callback} = $$props;
  let {checked} = $$props;
  let {callbackArgs} = $$props;
  if ($$props.callback === void 0 && $$bindings.callback && callback !== void 0)
    $$bindings.callback(callback);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.callbackArgs === void 0 && $$bindings.callbackArgs && callbackArgs !== void 0)
    $$bindings.callbackArgs(callbackArgs);
  $$result.css.add(css$4);
  return `<label class="${"switch svelte-1wgc2n4"}"><input type="${"checkbox"}" class="${"svelte-1wgc2n4"}"${add_attribute("checked", checked, 1)}>
  <span class="${"slider round svelte-1wgc2n4"}"></span>
</label>`;
});
var index_svelte = "img.svelte-1t6ndzl{border-radius:25px}.transparent.svelte-1t6ndzl{border:transparent;background-color:transparent}.pid.svelte-1t6ndzl{background-color:#FF4D4D;border-radius:0.5em;padding:2px;color:white;font-size:calc(100% + 1.1vw)}.image-overlay.svelte-1t6ndzl{width:50%;position:absolute;top:25%;right:0;bottom:25%;left:0;padding:1rem;border-radius:calc(.25rem - 1px)}";
const css$3 = {
  code: "img.svelte-1t6ndzl{border-radius:25px}.transparent.svelte-1t6ndzl{border:transparent;background-color:transparent}.pid.svelte-1t6ndzl{background-color:#FF4D4D;border-radius:0.5em;padding:2px;color:white;font-size:calc(100% + 1.1vw)}.image-overlay.svelte-1t6ndzl{width:50%;position:absolute;top:25%;right:0;bottom:25%;left:0;padding:1rem;border-radius:calc(.25rem - 1px)}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script>\\n  import { session } from \\"$app/stores\\";\\n  import pkg from 'lodash';\\n  import Slider from \\"../components/Slider.svelte\\";\\n\\n  const {_} = pkg;\\n\\n  let KE_PIDS = $session.constants.KE_PID;\\n  $: views = $session.configuration.views;\\n\\n  function toggleEnabled( id ) {\\n    fetch(\\"./api/config\\", {\\n        method : \\"PUT\\",\\n        headers: {\\n          'Content-Type': 'application/json',\\n        },\\n        body   : JSON.stringify({id: id})\\n    }).then(d => d.json())\\n    .then(d => {\\n      if ( !_.isEqual( views, d.views )) {\\n        views = d.views.views;\\n        $session.configuration.views = d.views.views;\\n      }\\n      console.log(d)\\n      $session.actions = [{\\n        id    : $session.count,\\n        msg   : d.message,\\n        theme : d.ret ? 'alert-info' : 'alert-warning',\\n      }, ...$session.actions];\\n    });\\n  }\\n</script>\\n\\n{#if views}\\n  {#each Object.keys(views) as id }\\n    <div class=\\"container col-sm-10 col-md-6 pr-4 pl-4\\">\\n\\n      <div class=\\"row m-2\\">\\n        <div class=\\"text-left col-6\\">\\n          <h5>{views[id].name}</h5>\\n        </div>\\n        <div class=\\"text-right col-6\\">\\n          <svelte:component this={Slider} callback={toggleEnabled} callbackArgs={id} checked={views[id].enabled} />\\n        </div>\\n      </div>\\n\\n      <a href=\\"/edit/{id}\\">\\n\\n        <div class=\\"card transparent\\">\\n          <img class=\\"card-img-top\\" src=\\"images/Background/{views[id].background}\\" alt=\\"view background\\">\\n\\n          <div class=\\"row card-img-overlay\\">\\n\\n            <div class=\\"col-6 text-left\\">\\n              <img class=\\"image-overlay\\" src=\\"images/{views[id].theme}/needle.png\\">\\n              <img class=\\"image-overlay\\" src=\\"images/{views[id].theme}/gauge.png\\">\\n            </div>\\n\\n            <div class=\\"col-6 d-flex flex-column justify-content-center\\">\\n              {#each views[id].gauges as gauge}\\n                {#if gauge && gauge.pid}\\n                  <div class=\\"text-center\\">\\n                    <p class=\\"pid\\">{ KE_PIDS[ gauge.pid ].shortName ? KE_PIDS[ gauge.pid ].shortName : KE_PIDS[ gauge.pid ].name }</p>\\n                  </div>\\n                {/if}\\n              {/each}\\n            </div>\\n\\n          </div>\\n        </div>\\n      </a>\\n    </div>\\n  {/each}\\n{/if}\\n\\n<style>\\n  img {\\n    border-radius: 25px;\\n  }\\n  .transparent {\\n    border: transparent;\\n    background-color: transparent;\\n  }\\n\\n  .pid {\\n    background-color: #FF4D4D;\\n    border-radius: 0.5em;\\n    padding: 2px;\\n    color: white;\\n    font-size:calc(100% + 1.1vw);\\n  }\\n\\n  .image-overlay {\\n    width: 50%;\\n    position: absolute;\\n    top: 25%;\\n    right: 0;\\n    bottom: 25%;\\n    left: 0;\\n    padding: 1rem;\\n    border-radius: calc(.25rem - 1px);\\n  }\\n</style>\\n"],"names":[],"mappings":"AA4EE,GAAG,eAAC,CAAC,AACH,aAAa,CAAE,IAAI,AACrB,CAAC,AACD,YAAY,eAAC,CAAC,AACZ,MAAM,CAAE,WAAW,CACnB,gBAAgB,CAAE,WAAW,AAC/B,CAAC,AAED,IAAI,eAAC,CAAC,AACJ,gBAAgB,CAAE,OAAO,CACzB,aAAa,CAAE,KAAK,CACpB,OAAO,CAAE,GAAG,CACZ,KAAK,CAAE,KAAK,CACZ,UAAU,KAAK,IAAI,CAAC,CAAC,CAAC,KAAK,CAAC,AAC9B,CAAC,AAED,cAAc,eAAC,CAAC,AACd,KAAK,CAAE,GAAG,CACV,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,GAAG,CACX,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,aAAa,CAAE,KAAK,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,AACnC,CAAC"}`
};
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let views;
  let $session, $$unsubscribe_session;
  $$unsubscribe_session = subscribe(session, (value) => $session = value);
  const {_} = pkg;
  let KE_PIDS = $session.constants.KE_PID;
  function toggleEnabled(id) {
    fetch("./api/config", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id})
    }).then((d2) => d2.json()).then((d2) => {
      if (!_.isEqual(views, d2.views)) {
        views = d2.views.views;
        set_store_value(session, $session.configuration.views = d2.views.views, $session);
      }
      console.log(d2);
      set_store_value(session, $session.actions = [
        {
          id: $session.count,
          msg: d2.message,
          theme: d2.ret ? "alert-info" : "alert-warning"
        },
        ...$session.actions
      ], $session);
    });
  }
  $$result.css.add(css$3);
  views = $session.configuration.views;
  $$unsubscribe_session();
  return `${views ? `${each(Object.keys(views), (id) => `<div class="${"container col-sm-10 col-md-6 pr-4 pl-4"}"><div class="${"row m-2"}"><div class="${"text-left col-6"}"><h5>${escape(views[id].name)}</h5></div>
        <div class="${"text-right col-6"}">${validate_component(Slider || missing_component, "svelte:component").$$render($$result, {
    callback: toggleEnabled,
    callbackArgs: id,
    checked: views[id].enabled
  }, {}, {})}
        </div></div>

      <a href="${"/edit/" + escape(id)}"><div class="${"card transparent svelte-1t6ndzl"}"><img class="${"card-img-top svelte-1t6ndzl"}" src="${"images/Background/" + escape(views[id].background)}" alt="${"view background"}">

          <div class="${"row card-img-overlay"}"><div class="${"col-6 text-left"}"><img class="${"image-overlay svelte-1t6ndzl"}" src="${"images/" + escape(views[id].theme) + "/needle.png"}">
              <img class="${"image-overlay svelte-1t6ndzl"}" src="${"images/" + escape(views[id].theme) + "/gauge.png"}"></div>

            <div class="${"col-6 d-flex flex-column justify-content-center"}">${each(views[id].gauges, (gauge) => `${gauge && gauge.pid ? `<div class="${"text-center"}"><p class="${"pid svelte-1t6ndzl"}">${escape(KE_PIDS[gauge.pid].shortName ? KE_PIDS[gauge.pid].shortName : KE_PIDS[gauge.pid].name)}</p>
                  </div>` : ``}`)}
            </div></div>
        </div></a>
    </div>`)}` : ``}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Routes
});
var advanced_svelte = "textarea.svelte-rfhj3t{width:100%;height:500px}";
const css$2 = {
  code: "textarea.svelte-rfhj3t{width:100%;height:500px}",
  map: `{"version":3,"file":"advanced.svelte","sources":["advanced.svelte"],"sourcesContent":["<script>\\n  import { session } from \\"$app/stores\\";\\n\\n  let configString = JSON.stringify( $session.configuration, null, 2 );\\n\\n  function submit() {\\n    fetch(\\"/api/config\\", {\\n        method : \\"POST\\",\\n        body   : configString\\n      })\\n      .then(d => d.json())\\n      .then(d => {\\n        $session.configuration = d.config;\\n        $session.actions = [{\\n          id    : $session.count,\\n          msg   : d.message,\\n          theme : d.ret ? 'alert-info' : 'alert-danger',\\n        }, ...$session.actions];\\n      });\\n  }\\n\\n  let invalid = false;\\n  $: {\\n    try {\\n        JSON.parse( configString );\\n        invalid = false;\\n    }\\n    catch ( e ) {\\n        invalid = true;\\n    }\\n  }\\n</script>\\n\\n<div class=\\"col-12 pr-4 pl-4 advanced\\">\\n\\n  {#if invalid}\\n    <div class=\\"alert alert-danger\\">\\n      Invalid JSON\\n    </div>\\n  {/if}\\n\\n  <textarea class=\\"form-control\\" bind:value=\\"{configString}\\"></textarea>\\n  <button disabled={invalid} class=\\"mt-2 form-control\\" type=\\"submit\\" on:click=\\"{submit}\\">Save</button>\\n</div>\\n\\n<style>\\n  textarea {\\n    width: 100%;\\n    height: 500px;\\n  }\\n</style>\\n"],"names":[],"mappings":"AA8CE,QAAQ,cAAC,CAAC,AACR,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,KAAK,AACf,CAAC"}`
};
const Advanced = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $session, $$unsubscribe_session;
  $$unsubscribe_session = subscribe(session, (value) => $session = value);
  let configString = JSON.stringify($session.configuration, null, 2);
  let invalid = false;
  $$result.css.add(css$2);
  {
    {
      try {
        JSON.parse(configString);
        invalid = false;
      } catch (e) {
        invalid = true;
      }
    }
  }
  $$unsubscribe_session();
  return `<div class="${"col-12 pr-4 pl-4 advanced"}">${invalid ? `<div class="${"alert alert-danger"}">Invalid JSON
    </div>` : ``}

  <textarea class="${"form-control svelte-rfhj3t"}">${configString || ""}</textarea>
  <button ${invalid ? "disabled" : ""} class="${"mt-2 form-control"}" type="${"submit"}">Save</button>
</div>`;
});
var advanced = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Advanced
});
const Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_session;
  $$unsubscribe_session = subscribe(session, (value) => value);
  let username;
  let password;
  $$unsubscribe_session();
  return `<form><div class="${"p-4 col-md-12 order-md-1"}"><div class="${"row"}"><div class="${"col-md-6 mb-3"}"><label for="${"username"}">Username</label>
          <input type="${"text"}" class="${"form-control"}" name="${"username"}" required${add_attribute("value", username, 1)}>
          <div class="${"invalid-feedback"}">Username is required
          </div></div>

        <div class="${"col-md-6 mb-3"}"><label for="${"password"}">Password</label>
          <input type="${"password"}" class="${"form-control"}" name="${"password"}" required${add_attribute("value", password, 1)}>
          <div class="${"invalid-feedback"}">Password is required
          </div></div></div>

    <button class="${"btn btn-lg btn-primary btn-block"}" type="${"submit"}">Update settings</button></div></form>`;
});
var settings = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Settings
});
const Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_session;
  $$unsubscribe_session = subscribe(session, (value) => value);
  let username;
  let password;
  $$unsubscribe_session();
  return `<div class="${"col-sm-12 col-md-6 justify-content-center d-flex"}"><form class="${"form-signin"}"><div class="${"text-center container"}"><img src="${"images/logo.png"}" alt="${""}" width="${"72"}" height="${"72"}">
      <h1 class="${"h3 mb-3 font-weight-normal"}">Please sign in</h1></div>

    <div class="${"form-label-group"}"><input type="${"text"}" name="${"username"}" id="${"Username"}" class="${"mb-2 form-control"}" placeholder="${"username"}" required${add_attribute("value", username, 1)}>
      <label for="${"username"}">Username</label></div>

    <div class="${"form-label-group"}"><input type="${"password"}" name="${"password"}" id="${"password"}" class="${"mb-2 form-control"}" placeholder="${"Password"}" required${add_attribute("value", password, 1)}>
      <label for="${"password"}">Password</label></div>

    <button class="${"btn btn-lg btn-primary btn-block"}" type="${"submit"}">Sign in</button></form></div>`;
});
var login = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Login
});
var _slug__svelte = ".alertContainer.svelte-19k1p7q{padding:5px;margin:5px;border-radius:0.5em;border:grey;border-width:1px;border-style:solid}.delete.svelte-19k1p7q{background-color:rgb(220, 176, 176)}";
const css$1 = {
  code: ".alertContainer.svelte-19k1p7q{padding:5px;margin:5px;border-radius:0.5em;border:grey;border-width:1px;border-style:solid}.delete.svelte-19k1p7q{background-color:rgb(220, 176, 176)}",
  map: `{"version":3,"file":"[slug].svelte","sources":["[slug].svelte"],"sourcesContent":["<script context=\\"module\\">\\n  export async function load({ page, context }) {\\n    return { props: { id: page.params.slug } };\\n  }\\n</script>\\n\\n<script>\\n  import { session } from \\"$app/stores\\";\\n  import Slider from \\"../../components/Slider.svelte\\";\\n\\n  export let id;\\n\\n  let configuration = $session.configuration;\\n\\n  let view     = configuration.views[id];\\n  const KE_PID = $session.constants.KE_PID;\\n  const pids   = Object.keys( KE_PID );\\n\\n  function normalizeGauges() {\\n    if ( view ) {\\n      // Ensure we always have 3 entries in our array\\n      while ( view.gauges.length != 3 ) {\\n        view.gauges.push({\\n          \\"module\\"      : \\"\\",\\n          \\"themeConfig\\" : \\"\\",\\n          \\"unit\\"        : \\"\\",\\n          \\"path\\"        : \\"\\",\\n          \\"pid\\"         : \\"\\"\\n        });\\n      }\\n    }\\n  }\\n  normalizeGauges();\\n\\n  function pidChange( node ) {\\n    function getUnits( node ) {\\n      const pid = node.target.value;\\n\\n      // find our units for the provided pid\\n      let unitsSelect = node.srcElement.parentElement.nextSibling.nextSibling.querySelectorAll('[name=units]')[0]\\n      // Clear our old units from units select input\\n      let i = 0;\\n      for (i = 0; i < unitsSelect.options.length; i++) {\\n        unitsSelect.remove(i);\\n      }\\n\\n      if ( !pid ) {\\n        unitsSelect.options[0] = new Option('-', '', false, false);\\n        return;\\n      }\\n      // Add our units to our select input\\n      Object.keys(KE_PID[pid].units).forEach((unit, i) => {\\n        unitsSelect.options[i] = new Option(unit, unit, false, false);\\n      });\\n      // Actually set the select value to the first unit\\n      unitsSelect.value = unitsSelect.options[0].value;\\n      unitsSelect.focus();\\n      unitsSelect.blur();\\n    }\\n    node.addEventListener( \\"change\\", getUnits );\\n    // Set our initial values\\n    var event = new Event('change');\\n    node.dispatchEvent( event );\\n\\n    return {\\n      destroy() {\\n        node.removeEventListener( \\"blur\\", getUnits );\\n      }\\n    }\\n  }\\n\\n  function handleSubmit(event) {\\n    // Here we need to sanitize our input :/\\n    let gauges = [];\\n    view.gauges.forEach( (gauge, i) => {\\n      if ( !gauge.pid || !gauge.unit ) {\\n        return;\\n      }\\n      else {\\n        gauges.push({\\n          \\"module\\"      : \\"Radial\\",\\n          \\"themeConfig\\" : \\"120\\",\\n          \\"unit\\"        : gauge.unit,\\n          \\"path\\"        : \\"/\\"+view.theme+\\"/\\",\\n          \\"pid\\"         : gauge.pid\\n        });\\n      }\\n    });\\n\\n    // We don't want to mutate view here as we do some gauge [] fanagling\\n    let temp_view           = view;\\n    temp_view.gauges        = gauges;\\n    configuration.views[id] = temp_view;\\n\\n    fetch(\\"/api/config\\", {\\n        method : \\"POST\\",\\n        body   : JSON.stringify( configuration )\\n      })\\n      .then(d => d.json())\\n      .then(d => {\\n        $session.configuration = d.config;\\n        normalizeGauges();\\n\\n        $session.actions = [{\\n          id    : $session.count,\\n          msg   : d.message,\\n          theme : d.ret ? 'alert-info' : 'alert-warning',\\n        }, ...$session.actions];\\n      });\\n  }\\n\\n  function addAlert() {\\n    view.alerts = [...view.alerts, {\\n      \\"message\\" : \\"\\",\\n      \\"op\\"      : \\"\\",\\n      \\"priority\\": \\"\\",\\n      \\"unit\\"    : \\"\\",\\n      \\"value\\"   : \\"\\",\\n    }];\\n  }\\n\\n  function removeAlert( index ) {\\n    let tempArr = view.alerts;\\n    tempArr.splice( index, 1 );\\n\\n    view.alerts = tempArr;\\n  }\\n\\n  function toggleDynamic() {\\n    view.dynamic.enabled = view.dynamic.enabled ? false : true;\\n  }\\n</script>\\n\\n<div class=\\"col-sm-12 col-sm-8 pb-4\\">\\n  {#if view}\\n  <div id=\\"edit-container\\" class=\\"container\\">\\n    <div class=\\"col-sm-12 order-sm-1\\">\\n      <h4 class=\\"mb-3\\">Editing view #{id}</h4>\\n      <form on:submit|preventDefault=\\"{handleSubmit}\\" class=\\"needs-validation\\">\\n        <input type=\\"hidden\\" value=\\"<%$id%>\\" name=\\"id\\"/>\\n\\n          <h4>Basics</h4>\\n          <hr/>\\n\\n        <div class=\\"basicsContainer\\">\\n          <div class=\\"row\\">\\n\\n            <div class=\\"col-12\\">\\n              <label for=\\"name\\">View name</label>\\n              <input bind:value={view.name} name=\\"name\\" type=\\"text\\" class=\\"form-control\\" id=\\"name\\" placeholder=\\"\\" required>\\n            </div>\\n\\n            <div class=\\"col-6\\">\\n              <label for=\\"background\\">Background</label>\\n              <select bind:value={view.background} name=\\"background\\" class=\\"custom-select form-control d-block w-100\\" id=\\"country\\" required>\\n                <option value=\\"\\">-</option>\\n                {#each ['banner1.jpg', 'bg.jpg', 'BlackBackground.png', 'CarbonFiber.png'] as background}\\n                <option value={background}>{background}</option>\\n                {/each}\\n              </select>\\n            </div>\\n\\n            <div class=\\"col-6\\">\\n              <label for=\\"theme\\">Theme</label>\\n              <select bind:value={view.theme} name=\\"theme\\" class=\\"form-control d-block w-100\\" id=\\"theme\\" required>\\n                <option value=\\"\\">-</option>\\n                {#each ['Stock'] as theme}\\n                <option value={theme}>{theme}</option>\\n                {/each}\\n              </select>\\n            </div>\\n\\n            <div class=\\"col-12\\">\\n              <label for=\\"theme\\">Vehicle Parameters</label>\\n              <div class=\\"input-group\\">\\n                {#each Array(3) as _, i}\\n                  <div class=\\"col-4 pl-1 pr-1\\">\\n                    <div class=\\"col-12\\">\\n                      <select use:pidChange bind:value={view.gauges[i].pid} name=\\"pid{id}\\" class=\\"mb-2 form-control\\" id=\\"pid{id}\\">\\n                        <option value=\\"\\">-</option>\\n                        {#each pids as pid}\\n                          <option value={pid}>\\n                            {KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name}\\n                          </option>\\n                        {/each}\\n                      </select>\\n                    </div>\\n\\n                    <!-- Units for PID -->\\n                    <div class=\\"col-12\\">\\n                      <select name=\\"units\\" on:blur=\\"{ e => view.gauges[i].unit = e.target.value }\\" value={view.gauges[i].unit} class=\\"form-control\\"></select>\\n                    </div>\\n                  </div>\\n                {/each}\\n              </div>\\n            </div>\\n\\n          </div>\\n        </div>\\n        <!-- END BASICS -->\\n\\n        <h4>Alerts</h4>\\n        <hr/>\\n\\n        <div class=\\"alertsContainer\\">\\n          {#each view.alerts as alert, i}\\n            <div class=\\"alertContainer\\">\\n\\n              <div class=\\"input-group\\">\\n                <div class=\\"col-sm-6 col-12 pl-1 pr-1\\">\\n                  <label class=\\"label\\" for=\\"alertMessage\\">Message</label>\\n                  <input required bind:value={alert.message} class=\\"value form-control\\" type=\\"text\\" name=\\"alertMessage\\"/>\\n                </div>\\n\\n                <div class=\\"col-sm-3 col-12 pl-1 pr-1\\">\\n                  <label class=\\"label\\" for=\\"alertValue\\">Value</label>\\n                  <input required bind:value={alert.value} class=\\"form-control\\" type=\\"text\\" name=\\"alertValue\\"/>\\n                </div>\\n\\n                <div class=\\"col-sm-3 col-12 pl-1 pr-1\\">\\n                  <label for=\\"alertOP\\">OP</label>\\n                  <select required bind:value={alert.op} name=\\"alertOP\\" class=\\"form-control\\">\\n                    <option value=\\"\\">-</option>\\n                    {#each ['=', '>', '<', '>=', '<='] as op}\\n                    <option value={op}>\\n                      {op}\\n                    </option>\\n                    {/each}\\n                  </select>\\n                </div>\\n\\n                <div class=\\"col-sm-6 col-12 pl-1 pr-1\\">\\n                  <label class=\\"label\\" for=\\"alertPID\\">PID</label>\\n\\n                  <select use:pidChange bind:value={alert.pid} name=\\"pid{id}\\" class=\\"value form-control pl-1 pr-1\\" id=\\"alertPID\\" required>\\n                    <option value=\\"\\">-</option>\\n                    {#each pids as pid}\\n                      <option value={pid}>\\n                        {pid ? KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name : ''}\\n                      </option>\\n                    {/each}\\n                  </select>\\n                </div>\\n\\n                <div class=\\"col-sm-3 col-12 pl-1 pr-1\\">\\n                  <label class=\\"label\\" for=\\"alertUnit\\">Unit</label>\\n                  <select name=\\"units\\" on:blur=\\"{ e => alert.unit = e.target.value }\\" value={alert.unit} class=\\"form-control value\\" required><option>-</option></select>\\n                </div>\\n\\n                <div class=\\"col-sm-3 col-12 pl-1 pr-1\\">\\n                  <label class=\\"label\\" for=\\"alertPriority\\">Priority</label>\\n                  <input required bind:value={alert.priority} class=\\"value form-control\\" type=\\"number\\" name=\\"alertPriority\\"/>\\n                </div>\\n              </div>\\n\\n              <div class=\\"mt-2 text-center\\">\\n                <button on:click=\\"{() => {removeAlert( i )}}\\" class=\\"form-control delete\\" type=\\"button\\">Delete</button>\\n              </div>\\n            </div>\\n          {/each}\\n\\n          <div class=\\"col-sm-12 col-auto\\">\\n            <button class=\\"form-control\\" on:click={() => addAlert()}>New alert</button>\\n          </div>\\n        </div>\\n        <!-- END ALERTS -->\\n\\n        <h4>Dynamic</h4>\\n        <hr/>\\n\\n        <div class=\\"dynamicContainer\\">\\n          <div class=\\"row\\">\\n            <div class=\\"col-sm-3 col-12\\">\\n              <svelte:component this={Slider} callback={toggleDynamic} callbackArgs={null} checked={view.dynamic.enabled} />\\n            </div>\\n          </div>\\n          <div class=\\"row\\">\\n\\n            <div class=\\"col-sm-3 col-12\\">\\n              <label for=\\"dynamicPID\\">PID</label>\\n\\n              <select use:pidChange bind:value={view.dynamic.pid} disabled={!view.dynamic.enabled} name=\\"pid{id}\\" class=\\"form-control\\" id=\\"dynamicPID\\" required>\\n                <option value=\\"\\">-</option>\\n                {#each pids as pid}\\n                  <option value={pid}>\\n                    {KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name}\\n                  </option>\\n                {/each}\\n              </select>\\n            </div>\\n\\n            <div class=\\"col-sm-3 col-12\\">\\n              <label class=\\"label\\" for=\\"dynamicUnit\\">Unit</label>\\n              <select name=\\"units\\" disabled={!view.dynamic.enabled} on:blur=\\"{ e => view.dynamic.unit = e.target.value }\\" value={view.dynamic.unit} class=\\"form-control value\\" required><option>-</option></select>\\n            </div>\\n\\n            <div class=\\"col-sm-3 col-12\\">\\n              <label for=\\"dynamicValue\\">Value</label>\\n              <input bind:value={view.dynamic.value} disabled={!view.dynamic.enabled} class=\\"form-control\\" type=\\"text\\" name=\\"dynamicValue\\"/>\\n            </div>\\n\\n            <div class=\\"col-sm-3 col-12\\">\\n              <label for=\\"dynamicOP\\">OP</label>\\n              <select bind:value={view.dynamic.op} name=\\"dynamicOP\\" disabled={!view.dynamic.enabled} class=\\"form-control\\">\\n                <option value=\\"\\">-</option>\\n                {#each ['=', '>', '<', '>=', '<='] as op}\\n                  <option value={op}>\\n                    {op}\\n                  </option>\\n                {/each}\\n              </select>\\n            </div>\\n\\n            <div class=\\"col-sm-3 col-12\\">\\n              <label for=\\"dynamicPriority\\">Priority</label>\\n              <input bind:value={view.dynamic.priority} disabled={!view.dynamic.enabled} class=\\"form-control\\" type=\\"number\\" name=\\"dynamicPriority\\"/>\\n            </div>\\n\\n          </div>\\n        </div>\\n\\n        <hr class=\\"mb-4\\">\\n        <button class=\\"btn btn-primary btn-lg btn-block\\" type=\\"submit\\">Update</button>\\n\\n      </form>\\n    </div>\\n  </div>\\n  {/if}\\n</div>\\n\\n<style>\\n  .basicsContainer {\\n    /* padding: 5px;\\n    border:turquoise;\\n    border-width: 2px;\\n    border-style: solid; */\\n  }\\n\\n  .alertsContainer {\\n    /* padding: 5px;\\n    border:rgb(101, 145, 140);\\n    border-width: 2px;\\n    border-style: solid; */\\n  }\\n\\n  .alertContainer {\\n    padding: 5px;\\n    margin: 5px;\\n    border-radius: 0.5em;\\n    border:grey;\\n    border-width: 1px;\\n    border-style: solid;\\n  }\\n\\n  .dynamicContainer {\\n    /* padding: 5px;\\n    border:rgb(104, 232, 104);\\n    border-width: 2px;\\n    border-style: solid; */\\n  }\\n\\n  .delete {\\n    background-color: rgb(220, 176, 176);\\n  }\\n</style>\\n"],"names":[],"mappings":"AAyVE,eAAe,eAAC,CAAC,AACf,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,GAAG,CACX,aAAa,CAAE,KAAK,CACpB,OAAO,IAAI,CACX,YAAY,CAAE,GAAG,CACjB,YAAY,CAAE,KAAK,AACrB,CAAC,AASD,OAAO,eAAC,CAAC,AACP,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACtC,CAAC"}`
};
async function load$1({page, context}) {
  return {props: {id: page.params.slug}};
}
const U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $session, $$unsubscribe_session;
  $$unsubscribe_session = subscribe(session, (value) => $session = value);
  let {id} = $$props;
  let configuration = $session.configuration;
  let view = configuration.views[id];
  const KE_PID = $session.constants.KE_PID;
  const pids = Object.keys(KE_PID);
  function normalizeGauges() {
    if (view) {
      while (view.gauges.length != 3) {
        view.gauges.push({
          module: "",
          themeConfig: "",
          unit: "",
          path: "",
          pid: ""
        });
      }
    }
  }
  normalizeGauges();
  function toggleDynamic() {
    view.dynamic.enabled = view.dynamic.enabled ? false : true;
  }
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  $$result.css.add(css$1);
  $$unsubscribe_session();
  return `<div class="${"col-sm-12 col-sm-8 pb-4"}">${view ? `<div id="${"edit-container"}" class="${"container"}"><div class="${"col-sm-12 order-sm-1"}"><h4 class="${"mb-3"}">Editing view #${escape(id)}</h4>
      <form class="${"needs-validation"}"><input type="${"hidden"}" value="${"<%$id%>"}" name="${"id"}">

          <h4>Basics</h4>
          <hr>

        <div class="${"basicsContainer svelte-19k1p7q"}"><div class="${"row"}"><div class="${"col-12"}"><label for="${"name"}">View name</label>
              <input name="${"name"}" type="${"text"}" class="${"form-control"}" id="${"name"}" placeholder="${""}" required${add_attribute("value", view.name, 1)}></div>

            <div class="${"col-6"}"><label for="${"background"}">Background</label>
              <select name="${"background"}" class="${"custom-select form-control d-block w-100"}" id="${"country"}" required${add_attribute("value", view.background, 1)}><option value="${""}">-</option>${each(["banner1.jpg", "bg.jpg", "BlackBackground.png", "CarbonFiber.png"], (background) => `<option${add_attribute("value", background, 0)}>${escape(background)}</option>`)}</select></div>

            <div class="${"col-6"}"><label for="${"theme"}">Theme</label>
              <select name="${"theme"}" class="${"form-control d-block w-100"}" id="${"theme"}" required${add_attribute("value", view.theme, 1)}><option value="${""}">-</option>${each(["Stock"], (theme) => `<option${add_attribute("value", theme, 0)}>${escape(theme)}</option>`)}</select></div>

            <div class="${"col-12"}"><label for="${"theme"}">Vehicle Parameters</label>
              <div class="${"input-group"}">${each(Array(3), (_, i) => `<div class="${"col-4 pl-1 pr-1"}"><div class="${"col-12"}"><select name="${"pid" + escape(id)}" class="${"mb-2 form-control"}" id="${"pid" + escape(id)}"${add_attribute("value", view.gauges[i].pid, 1)}><option value="${""}">-</option>${each(pids, (pid) => `<option${add_attribute("value", pid, 0)}>${escape(KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name)}
                          </option>`)}</select></div>

                    
                    <div class="${"col-12"}"><select name="${"units"}"${add_attribute("value", view.gauges[i].unit, 0)} class="${"form-control"}"></select></div>
                  </div>`)}</div></div></div></div>
        

        <h4>Alerts</h4>
        <hr>

        <div class="${"alertsContainer svelte-19k1p7q"}">${each(view.alerts, (alert, i) => `<div class="${"alertContainer svelte-19k1p7q"}"><div class="${"input-group"}"><div class="${"col-sm-6 col-12 pl-1 pr-1"}"><label class="${"label"}" for="${"alertMessage"}">Message</label>
                  <input required class="${"value form-control"}" type="${"text"}" name="${"alertMessage"}"${add_attribute("value", alert.message, 1)}></div>

                <div class="${"col-sm-3 col-12 pl-1 pr-1"}"><label class="${"label"}" for="${"alertValue"}">Value</label>
                  <input required class="${"form-control"}" type="${"text"}" name="${"alertValue"}"${add_attribute("value", alert.value, 1)}></div>

                <div class="${"col-sm-3 col-12 pl-1 pr-1"}"><label for="${"alertOP"}">OP</label>
                  <select required name="${"alertOP"}" class="${"form-control"}"${add_attribute("value", alert.op, 1)}><option value="${""}">-</option>${each(["=", ">", "<", ">=", "<="], (op) => `<option${add_attribute("value", op, 0)}>${escape(op)}
                    </option>`)}</select></div>

                <div class="${"col-sm-6 col-12 pl-1 pr-1"}"><label class="${"label"}" for="${"alertPID"}">PID</label>

                  <select name="${"pid" + escape(id)}" class="${"value form-control pl-1 pr-1"}" id="${"alertPID"}" required${add_attribute("value", alert.pid, 1)}><option value="${""}">-</option>${each(pids, (pid) => `<option${add_attribute("value", pid, 0)}>${escape(pid ? KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name : "")}
                      </option>`)}</select></div>

                <div class="${"col-sm-3 col-12 pl-1 pr-1"}"><label class="${"label"}" for="${"alertUnit"}">Unit</label>
                  <select name="${"units"}"${add_attribute("value", alert.unit, 0)} class="${"form-control value"}" required><option value="${"-"}">-</option></select></div>

                <div class="${"col-sm-3 col-12 pl-1 pr-1"}"><label class="${"label"}" for="${"alertPriority"}">Priority</label>
                  <input required class="${"value form-control"}" type="${"number"}" name="${"alertPriority"}"${add_attribute("value", alert.priority, 1)}>
                </div></div>

              <div class="${"mt-2 text-center"}"><button class="${"form-control delete svelte-19k1p7q"}" type="${"button"}">Delete</button></div>
            </div>`)}

          <div class="${"col-sm-12 col-auto"}"><button class="${"form-control"}">New alert</button></div></div>
        

        <h4>Dynamic</h4>
        <hr>

        <div class="${"dynamicContainer svelte-19k1p7q"}"><div class="${"row"}"><div class="${"col-sm-3 col-12"}">${validate_component(Slider || missing_component, "svelte:component").$$render($$result, {
    callback: toggleDynamic,
    callbackArgs: null,
    checked: view.dynamic.enabled
  }, {}, {})}</div></div>
          <div class="${"row"}"><div class="${"col-sm-3 col-12"}"><label for="${"dynamicPID"}">PID</label>

              <select ${!view.dynamic.enabled ? "disabled" : ""} name="${"pid" + escape(id)}" class="${"form-control"}" id="${"dynamicPID"}" required${add_attribute("value", view.dynamic.pid, 1)}><option value="${""}">-</option>${each(pids, (pid) => `<option${add_attribute("value", pid, 0)}>${escape(KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name)}
                  </option>`)}</select></div>

            <div class="${"col-sm-3 col-12"}"><label class="${"label"}" for="${"dynamicUnit"}">Unit</label>
              <select name="${"units"}" ${!view.dynamic.enabled ? "disabled" : ""}${add_attribute("value", view.dynamic.unit, 0)} class="${"form-control value"}" required><option value="${"-"}">-</option></select></div>

            <div class="${"col-sm-3 col-12"}"><label for="${"dynamicValue"}">Value</label>
              <input ${!view.dynamic.enabled ? "disabled" : ""} class="${"form-control"}" type="${"text"}" name="${"dynamicValue"}"${add_attribute("value", view.dynamic.value, 1)}></div>

            <div class="${"col-sm-3 col-12"}"><label for="${"dynamicOP"}">OP</label>
              <select name="${"dynamicOP"}" ${!view.dynamic.enabled ? "disabled" : ""} class="${"form-control"}"${add_attribute("value", view.dynamic.op, 1)}><option value="${""}">-</option>${each(["=", ">", "<", ">=", "<="], (op) => `<option${add_attribute("value", op, 0)}>${escape(op)}
                  </option>`)}</select></div>

            <div class="${"col-sm-3 col-12"}"><label for="${"dynamicPriority"}">Priority</label>
              <input ${!view.dynamic.enabled ? "disabled" : ""} class="${"form-control"}" type="${"number"}" name="${"dynamicPriority"}"${add_attribute("value", view.dynamic.priority, 1)}></div></div></div>

        <hr class="${"mb-4"}">
        <button class="${"btn btn-primary btn-lg btn-block"}" type="${"submit"}">Update</button></form></div></div>` : ``}
</div>`;
});
var _slug_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: U5Bslugu5D,
  load: load$1
});
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {segment} = $$props;
  if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0)
    $$bindings.segment(segment);
  return `<div class="${"m-4"}"><div class="${"nav-scroller py-1 mb-2"}"><nav class="${"navbar navbar-expand-md navbar-dark fixed-top bg-dark"}"><div class="${"container-fluid"}"><a class="${"navbar-brand"}" href="${"/"}">KE</a>
        <button class="${"navbar-toggler"}" type="${"button"}" data-toggle="${"collapse"}" data-target="${"#navbarCollapse"}" aria-controls="${"navbarCollapse"}" aria-expanded="${"false"}" aria-label="${"Toggle navigation"}"><span class="${"navbar-toggler-icon"}"></span></button>
        <div class="${"collapse navbar-collapse"}" id="${"navbarCollapse"}"><ul class="${"navbar-nav nav mr-auto mb-2 mb-md-0"}"><li class="${"nav-item"}"><a class="${["nav-link", !segment ? "active" : ""].join(" ").trim()}" href="${"/"}">Home</a></li>
            <li class="${"nav-item"}"><a class="${["nav-link", segment === "settings" ? "active" : ""].join(" ").trim()}" href="${"/settings"}">Settings</a></li>
            <li class="${"nav-item"}"><a class="${["nav-link", segment === "advanced" ? "active" : ""].join(" ").trim()}" href="${"/advanced"}">Advanced</a></li></ul></div></div></nav></div></div>`;
});
var Notifications_svelte = ".notifications.svelte-mlqs8o{width:50%;left:25%;right:25%;z-index:2;position:fixed}.notification.svelte-mlqs8o{position:relative}";
const css = {
  code: ".notifications.svelte-mlqs8o{width:50%;left:25%;right:25%;z-index:2;position:fixed}.notification.svelte-mlqs8o{position:relative}",
  map: '{"version":3,"file":"Notifications.svelte","sources":["Notifications.svelte"],"sourcesContent":["{#if $session.actions && $session.actions.length}\\n  <div class=\\"notifications\\" id=\\"notifications\\">\\n    {#each $session.actions as action(action.id)}\\n      <div\\n        class=\\"alert-dismissible fade show alert {action.theme}\\"\\n        role=\\"alert\\"\\n      >\\n        {action.msg}\\n\\n        <button  on:click=\\"{() => remove(action.id)}\\" type=\\"button\\" class=\\"btn-close\\" aria-label=\\"Close\\"></button>\\n      </div>\\n    {/each}\\n  </div>\\n{/if}\\n\\n<script>\\n  import { session } from \\"$app/stores\\";\\n\\n  $: {\\n    if ( $session.actions.length ) {\\n      $session.count = $session.count + 1;\\n    }\\n  }\\n\\n  function remove( id ) {\\n    $session.actions = $session.actions.filter(action => action.id != id);\\n  }\\n</script>\\n\\n<style>\\n  .notifications {\\n    width: 50%;\\n    left: 25%;\\n    right: 25%;\\n    z-index: 2;\\n    position: fixed;\\n  }\\n\\n  .notification {\\n    position: relative;\\n  }\\n</style>\\n"],"names":[],"mappings":"AA8BE,cAAc,cAAC,CAAC,AACd,KAAK,CAAE,GAAG,CACV,IAAI,CAAE,GAAG,CACT,KAAK,CAAE,GAAG,CACV,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,KAAK,AACjB,CAAC,AAED,aAAa,cAAC,CAAC,AACb,QAAQ,CAAE,QAAQ,AACpB,CAAC"}'
};
const Notifications = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $session, $$unsubscribe_session;
  $$unsubscribe_session = subscribe(session, (value) => $session = value);
  $$result.css.add(css);
  {
    {
      if ($session.actions.length) {
        set_store_value(session, $session.count = $session.count + 1, $session);
      }
    }
  }
  $$unsubscribe_session();
  return `${$session.actions && $session.actions.length ? `<div class="${"notifications svelte-mlqs8o"}" id="${"notifications"}">${each($session.actions, (action) => `<div class="${"alert-dismissible fade show alert " + escape(action.theme) + " svelte-mlqs8o"}" role="${"alert"}">${escape(action.msg)}

        <button type="${"button"}" class="${"btn-close"}" aria-label="${"Close"}"></button>
      </div>`)}</div>` : ``}`;
});
async function load({page, session: session2}) {
  const {user: user2} = session2;
  if (!user2 && page.path != "/login") {
    return {redirect: "/login", status: 301};
  }
  return {props: {segment: page.path}};
}
const $layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {segment = void 0} = $$props;
  let {title = "KE!"} = $$props;
  if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0)
    $$bindings.segment(segment);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  return `${$$result.head += `${$$result.title = `<title>${escape(title)}</title>`, ""}`, ""}

${!segment || segment != "/login" ? `${validate_component(Nav || missing_component, "svelte:component").$$render($$result, {segment}, {}, {})}` : ``}

<div class="${"col-sm-12 col-md-6"}">${validate_component(Notifications || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div>

${slots.default ? slots.default({}) : ``}
${escape("")}`;
});
var $layout$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: $layout,
  load
});
export {init, render};
