# Chapter 4: Encoding and Evolution

> **How data moves across process boundaries, why binary formats matter, and how schema evolution keeps systems compatible over time.**

Applications use data in two different forms:

1. **In-memory representation**: objects, structs, arrays, hash maps, trees.
2. **Byte-level representation**: a self-contained sequence of bytes for disk/network.

This conversion is **encoding/serialization** (and decoding/deserialization on read).

---

## I. Why Encoding Exists

```mermaid
flowchart LR
    appData[In-memory Objects] --> encode[Encoder]
    encode --> wire[Bytes on Disk or Network]
    wire --> decode[Decoder]
    decode --> appData2[In-memory Objects]
```

Pointers are process-local, so data crossing process boundaries must be encoded into portable bytes.

---

## II. Language-Specific Encodings and Problems

Language-coupled formats are convenient but risky:

1. **Interoperability pain** across polyglot services.
2. **Security risks** from arbitrary class instantiation during decode.
3. **Weak schema evolution support** in many native serializers.
4. **Performance overhead** (e.g., classic Java serialization bloat).

---

## III. Text Formats: JSON, XML, CSV

### Number ambiguity

- XML/CSV cannot reliably distinguish numbers from numeric strings without schema.
- JSON has number/string distinction, but precision and int-vs-float details can be ambiguous.

### Binary data handling

JSON/XML are text-oriented; raw bytes are usually Base64-encoded (size overhead).

### CSV schema ambiguity

CSV has no built-in schema; producer/consumer changes need careful coordination.

---

## IV. Why Binary Encodings Matter

At scale, format choice impacts:

- Network bandwidth
- Storage footprint
- CPU parsing cost
- Latency

JSON is compact vs XML, but still verbose compared to binary.

---

## V. Thrift and Protocol Buffers

- **Protocol Buffers** (Google)
- **Thrift** (Facebook)

Both are schema-driven and use generated code for multiple languages.

JSON:

```json
{
  "userName": "Martin",
  "favoriteNumber": 1337,
  "interests": ["daydreaming", "hacking"]
}
```

Thrift:

```thrift
struct Person {
  1: required string userName,
  2: optional i64 favoriteNumber,
  3: optional list<string> interests
}
```

Protobuf:

```proto
message Person {
  required string user_name = 1;
  optional int64 favorite_number = 2;
  repeated string interests = 3;
}
```

---

## VI. Thrift BinaryProtocol: Byte-Level View

JSON payload:

```json
{
  "productId": 256,
  "name": "Cup",
  "inStock": true
}
```

Schema:

```thrift
struct Product {
  1: i32 productId,
  2: string name,
  3: bool inStock
}
```

Encoded bytes:

```text
08 00 01 00 00 01 00 0b 00 02 00 00 00 03 43 75 70 02 00 03 01 00
```

Parsing pattern:

**[Field Type] + [Field ID] + [Value] ... until STOP marker**

```mermaid
flowchart LR
    B1[08 00 01 00 00 01 00] --> F1[Field1 i32 productId=256]
    B2[0b 00 02 00 00 00 03 43 75 70] --> F2[Field2 string name=Cup]
    B3[02 00 03 01] --> F3[Field3 bool inStock=true]
    B4[00] --> EndMarker[STOP]
```

### Interactive Decoder Lab

Use this mini game to decode the same payload step-by-step.

<div class="thrift-mini-game" data-bytes="08 00 01 00 00 01 00 0b 00 02 00 00 00 03 43 75 70 02 00 03 01 00">
  <div class="thrift-game-header">
    <strong>BinaryProtocol Stream Explorer</strong>
    <span class="thrift-progress">Step 1 / 5</span>
  </div>
  <div class="thrift-bytes-row"></div>
  <div class="thrift-step-panel">
    <div class="thrift-step-label"></div>
    <div class="thrift-step-explain"></div>
  </div>
  <div class="thrift-controls">
    <button class="md-button thrift-prev">Prev</button>
    <button class="md-button md-button--primary thrift-next">Next</button>
    <button class="md-button thrift-auto">Auto Play</button>
    <button class="md-button thrift-reset">Reset</button>
  </div>
</div>

---

## VII. Schema Evolution and Compatibility

Field IDs (tags) are the wire contract.

- Field names can change.
- Tag numbers must remain stable.
- Type changes require caution.

### Forward compatibility

Old readers skip unknown tags written by new writers.

**Real-life example (mobile app rollout):**
Your backend adds a new optional field `user_tier = 4` (`FREE`, `PRO`) to a Protobuf `UserProfile` response. Users on older app versions (old reader) don't know tag `4`, so they ignore it and still render name/email correctly.

### Backward compatibility

New readers can read old data if newly added fields are optional/defaulted.

**Real-life example (event streaming with mixed producers):**
You deploy a new consumer that expects an optional `discount_code` field in `OrderCreated` events. Some services are still publishing the old event schema without that field. The new consumer reads those old events and safely treats `discount_code` as empty/default.

```mermaid
flowchart TD
    NewWriter[New Writer with optional fields] --> OldReader[Old Reader]
    OldReader --> IgnoreUnknown[Unknown tags ignored]

    OldWriter[Old Writer] --> NewReader[New Reader]
    NewReader --> FillDefaults[Missing fields defaulted]
```

Rules:

1. Never recycle old tag numbers.
2. New fields should be optional/defaulted.
3. Remove only optional fields, and never reuse their tags.

---

## VIII. Data Type Changes and Risk

Example: `int32` -> `int64`

- New readers can generally read old `int32`.
- Old readers may truncate large `int64` values.

So type changes must be rolled out carefully.

---

## IX. Repeated Fields in Protocol Buffers

```proto
repeated string interests = 3;
```

The same tag can appear multiple times and is decoded as a list.

### Protocol Buffers: Byte-Level Mini Lab

For the same product data, Protobuf wire bytes (varint + length-delimited encoding) can look like:

```text
08 80 02 12 03 43 75 70 18 01
```

Where:
- `08` = field 1, wire type 0 (varint)
- `80 02` = 256 in varint form
- `12` = field 2, wire type 2 (length-delimited)
- `03` + `43 75 70` = length 3 + `Cup`
- `18` = field 3, wire type 0 (varint)
- `01` = `true`

<div class="thrift-mini-game"
     data-bytes="08 80 02 12 03 43 75 70 18 01"
     data-steps='[
       {"label":"Field 1 key","range":[0,0],"explanation":"08 = (field 1 << 3) | wire_type 0. So field=1, varint value follows."},
       {"label":"Field 1 value (varint)","range":[1,2],"explanation":"80 02 is varint-encoded 256."},
       {"label":"Field 2 key + length","range":[3,4],"explanation":"12 = field 2, wire_type 2 (length-delimited). 03 means next 3 bytes are string data."},
       {"label":"Field 2 string bytes","range":[5,7],"explanation":"43 75 70 is UTF-8 for C u p."},
       {"label":"Field 3 key + bool","range":[8,9],"explanation":"18 = field 3, wire_type 0. 01 = true."}
     ]'>
  <div class="thrift-game-header">
    <strong>Protobuf Wire Stream Explorer</strong>
    <span class="thrift-progress">Step 1 / 5</span>
  </div>
  <div class="thrift-bytes-row"></div>
  <div class="thrift-step-panel">
    <div class="thrift-step-label"></div>
    <div class="thrift-step-explain"></div>
  </div>
  <div class="thrift-controls">
    <button class="md-button thrift-prev">Prev</button>
    <button class="md-button md-button--primary thrift-next">Next</button>
    <button class="md-button thrift-auto">Auto Play</button>
    <button class="md-button thrift-reset">Reset</button>
  </div>
</div>

---

## X. REST vs SOAP (Quick Contrast)

- **REST**: architectural style over HTTP.
- **SOAP**: strict XML-based protocol.

Specs:

- REST commonly uses **OpenAPI/Swagger**.
- SOAP commonly uses **WSDL**.

---

*Last Updated: May 28, 2026*

**End Note**: Encoding is a long-term contract between independently evolving systems. Teams that treat schema evolution as a first-class concern avoid brittle migrations, silent corruption, and expensive rewrites.
