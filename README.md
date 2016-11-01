# Specky 👓 [![Circle CI](https://circleci.com/gh/settinghead/specky.svg?style=svg)](https://circleci.com/gh/settinghead/specky)

### Project status
- Pre-alpha. Under active development.

### What

A powerful & highly flexible JavaScript data validation and conformation framework that enables you to:

- Build your data validation rules (specs) with composable, regex-like expressions built from primitives predicates such as `and`, `or`, `any`, `oneOrMore`, `zeroOrMore`, etc
- Validate and make assertions about your data with these predicate functions
- Assert & validate the shape and properties of your function's arguments and its return value
- Conform your data with a range of available shapes of specs
- Automatically generate test cases for your spec'ed functions

### Examples

For more examples on usage, refer to examples in the test folder [`/test`](test/).

### Generative Testing

WIP

### Why

It facilitates

- A better debugging experience
- [Data-driven programming](http://stackoverflow.com/a/1065657/707362)
- Auto generation of property-based/generative tests, and hence
- More comprehensive test case coverage
- Creation of constrained environment that is more powerful than typed languages such as TypeScript

### Run tests

#### In Dev mode

```bash
npm run dev
```

#### In CI mode
```bash
npm run test
```

### Credit
- Both origin of the idea and API are heavily inspired by Rich Hickey's [clojure.spec](http://clojure.org/about/spec)
- NFA spec matching inspired by Thompson NFA regex matching algorithm, and is based on [afader's implementation](https://github.com/afader/thompson-regex-js)
