/* eslint-disable */

import { AllTypesProps, ReturnTypes, Ops } from './const';
export const HOST = "http://localhost:3000/graphql"


export const HEADERS = {}
export const apiSubscription = (options: chainOptions) => (query: string) => {
  try {
    const queryString = options[0] + '?query=' + encodeURIComponent(query);
    const wsString = queryString.replace('http', 'ws');
    const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
    const webSocketOptions = options[1]?.websocket || [host];
    const ws = new WebSocket(...webSocketOptions);
    return {
      ws,
      on: (e: (args: any) => void) => {
        ws.onmessage = (event: any) => {
          if (event.data) {
            const parsed = JSON.parse(event.data);
            const data = parsed.data;
            return e(data);
          }
        };
      },
      off: (e: (args: any) => void) => {
        ws.onclose = e;
      },
      error: (e: (args: any) => void) => {
        ws.onerror = e;
      },
      open: (e: () => void) => {
        ws.onopen = e;
      },
    };
  } catch {
    throw new Error('No websockets implemented');
  }
};
const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then((text) => {
          try {
            reject(JSON.parse(text));
          } catch (err) {
            reject(text);
          }
        })
        .catch(reject);
    });
  }
  return response.json() as Promise<GraphQLResponse>;
};

export const apiFetch =
  (options: fetchOptions) =>
  (query: string, variables: Record<string, unknown> = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetch(`${options[0]}`, {
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };

export const InternalsBuildQuery = ({
  ops,
  props,
  returns,
  options,
  scalars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  options?: OperationOptions;
  scalars?: ScalarDefinition;
}) => {
  const ibb = (
    k: string,
    o: InputValueType | VType,
    p = '',
    root = true,
    vars: Array<{ name: string; graphQLType: string }> = [],
  ): string => {
    const keyForPath = purifyGraphQLKey(k);
    const newPath = [p, keyForPath].join(SEPARATOR);
    if (!o) {
      return '';
    }
    if (typeof o === 'boolean' || typeof o === 'number') {
      return k;
    }
    if (typeof o === 'string') {
      return `${k} ${o}`;
    }
    if (Array.isArray(o)) {
      const args = InternalArgsBuilt({
        props,
        returns,
        ops,
        scalars,
        vars,
      })(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(`${alias}:${operationName}`, operation, p, false, vars);
        })
        .join('\n');
    }
    const hasOperationName = root && options?.operationName ? ' ' + options.operationName : '';
    const keyForDirectives = o.__directives ?? '';
    const query = `{${Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false, vars))
      .join('\n')}}`;
    if (!root) {
      return `${k} ${keyForDirectives}${hasOperationName} ${query}`;
    }
    const varsString = vars.map((v) => `${v.name}: ${v.graphQLType}`).join(', ');
    return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ''} ${query}`;
  };
  return ibb;
};

type UnionOverrideKeys<T, U> = Omit<T, keyof U> & U;

export const Thunder =
  <SCLR extends ScalarDefinition>(fn: FetchFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) =>
  <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>,
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z & {
      [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never;
    },
    ops?: OperationOptions & { variables?: Record<string, unknown> },
  ) => {
    const options = {
      ...thunderGraphQLOptions,
      ...graphqlOptions,
    };
    return fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
      }),
      ops?.variables,
    ).then((data) => {
      if (options?.scalars) {
        return decodeScalarsInResponse({
          response: data,
          initialOp: operation,
          initialZeusQuery: o as VType,
          returns: ReturnTypes,
          scalars: options.scalars,
          ops: Ops,
        });
      }
      return data;
    }) as Promise<InputType<GraphQLTypes[R], Z, UnionOverrideKeys<SCLR, OVERRIDESCLR>>>;
  };

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder =
  <SCLR extends ScalarDefinition>(fn: SubscriptionFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) =>
  <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>,
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z & {
      [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never;
    },
    ops?: OperationOptions & { variables?: ExtractVariables<Z> },
  ) => {
    const options = {
      ...thunderGraphQLOptions,
      ...graphqlOptions,
    };
    type CombinedSCLR = UnionOverrideKeys<SCLR, OVERRIDESCLR>;
    const returnedFunction = fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
      }),
    ) as SubscriptionToGraphQL<Z, GraphQLTypes[R], CombinedSCLR>;
    if (returnedFunction?.on && options?.scalars) {
      const wrapped = returnedFunction.on;
      returnedFunction.on = (fnToCall: (args: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => void) =>
        wrapped((data: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => {
          if (options?.scalars) {
            return fnToCall(
              decodeScalarsInResponse({
                response: data,
                initialOp: operation,
                initialZeusQuery: o as VType,
                returns: ReturnTypes,
                scalars: options.scalars,
                ops: Ops,
              }),
            );
          }
          return fnToCall(data);
        });
    }
    return returnedFunction;
  };

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>,
>(
  operation: O,
  o: Z,
  ops?: {
    operationOptions?: OperationOptions;
    scalars?: ScalarDefinition;
  },
) =>
  InternalsBuildQuery({
    props: AllTypesProps,
    returns: ReturnTypes,
    ops: Ops,
    options: ops?.operationOptions,
    scalars: ops?.scalars,
  })(operation, o as VType);

export const ZeusSelect = <T>() => ((t: unknown) => t) as SelectionFunction<T>;

export const Selector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();

export const TypeFromSelector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();
export const Gql = Chain(HOST, {
  headers: {
    'Content-Type': 'application/json',
    ...HEADERS,
  },
});

export const ZeusScalars = ZeusSelect<ScalarCoders>();

type BaseSymbol = number | string | undefined | boolean | null;

type ScalarsSelector<T, V> = {
  [X in Required<{
    [P in keyof T]: P extends keyof V
      ? V[P] extends Array<any> | undefined
        ? never
        : T[P] extends BaseSymbol | Array<BaseSymbol>
        ? P
        : never
      : never;
  }>[keyof T]]: true;
};

export const fields = <T extends keyof ModelTypes>(k: T) => {
  const t = ReturnTypes[k];
  const fnType = k in AllTypesProps ? AllTypesProps[k as keyof typeof AllTypesProps] : undefined;
  const hasFnTypes = typeof fnType === 'object' ? fnType : undefined;
  const o = Object.fromEntries(
    Object.entries(t)
      .filter(([k, value]) => {
        const isFunctionType = hasFnTypes && k in hasFnTypes && !!hasFnTypes[k as keyof typeof hasFnTypes];
        if (isFunctionType) return false;
        const isReturnType = ReturnTypes[value as string];
        if (!isReturnType) return true;
        if (typeof isReturnType !== 'string') return false;
        if (isReturnType.startsWith('scalar.')) {
          return true;
        }
        return false;
      })
      .map(([key]) => [key, true as const]),
  );
  return o as ScalarsSelector<ModelTypes[T], T extends keyof ValueTypes ? ValueTypes[T] : never>;
};

export const decodeScalarsInResponse = <O extends Operations>({
  response,
  scalars,
  returns,
  ops,
  initialZeusQuery,
  initialOp,
}: {
  ops: O;
  response: any;
  returns: ReturnTypesType;
  scalars?: Record<string, ScalarResolver | undefined>;
  initialOp: keyof O;
  initialZeusQuery: InputValueType | VType;
}) => {
  if (!scalars) {
    return response;
  }
  const builder = PrepareScalarPaths({
    ops,
    returns,
  });

  const scalarPaths = builder(initialOp as string, ops[initialOp], initialZeusQuery);
  if (scalarPaths) {
    const r = traverseResponse({ scalarPaths, resolvers: scalars })(initialOp as string, response, [ops[initialOp]]);
    return r;
  }
  return response;
};

export const traverseResponse = ({
  resolvers,
  scalarPaths,
}: {
  scalarPaths: { [x: string]: `scalar.${string}` };
  resolvers: {
    [x: string]: ScalarResolver | undefined;
  };
}) => {
  const ibb = (k: string, o: InputValueType | VType, p: string[] = []): unknown => {
    if (Array.isArray(o)) {
      return o.map((eachO) => ibb(k, eachO, p));
    }
    if (o == null) {
      return o;
    }
    const scalarPathString = p.join(SEPARATOR);
    const currentScalarString = scalarPaths[scalarPathString];
    if (currentScalarString) {
      const currentDecoder = resolvers[currentScalarString.split('.')[1]]?.decode;
      if (currentDecoder) {
        return currentDecoder(o);
      }
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string' || !o) {
      return o;
    }
    const entries = Object.entries(o).map(([k, v]) => [k, ibb(k, v, [...p, purifyGraphQLKey(k)])] as const);
    const objectFromEntries = entries.reduce<Record<string, unknown>>((a, [k, v]) => {
      a[k] = v;
      return a;
    }, {});
    return objectFromEntries;
  };
  return ibb;
};

export type AllTypesPropsType = {
  [x: string]:
    | undefined
    | `scalar.${string}`
    | 'enum'
    | {
        [x: string]:
          | undefined
          | string
          | {
              [x: string]: string | undefined;
            };
      };
};

export type ReturnTypesType = {
  [x: string]:
    | {
        [x: string]: string | undefined;
      }
    | `scalar.${string}`
    | undefined;
};
export type InputValueType = {
  [x: string]: undefined | boolean | string | number | [any, undefined | boolean | InputValueType] | InputValueType;
};
export type VType =
  | undefined
  | boolean
  | string
  | number
  | [any, undefined | boolean | InputValueType]
  | InputValueType;

export type PlainType = boolean | number | string | null | undefined;
export type ZeusArgsType =
  | PlainType
  | {
      [x: string]: ZeusArgsType;
    }
  | Array<ZeusArgsType>;

export type Operations = Record<string, string>;

export type VariableDefinition = {
  [x: string]: unknown;
};

export const SEPARATOR = '|';

export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (...args: infer R) => WebSocket ? R : never;
export type chainOptions = [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }] | [fetchOptions[0]];
export type FetchFunction = (query: string, variables?: Record<string, unknown>) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export type OperationOptions = {
  operationName?: string;
};

export type ScalarCoder = Record<string, (s: unknown) => string>;

export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
export class GraphQLError extends Error {
  constructor(public response: GraphQLResponse) {
    super('');
    console.error(response);
  }
  toString() {
    return 'GraphQL Response Error';
  }
}
export type GenericOperation<O> = O extends keyof typeof Ops ? typeof Ops[O] : never;
export type ThunderGraphQLOptions<SCLR extends ScalarDefinition> = {
  scalars?: SCLR | ScalarCoders;
};

const ExtractScalar = (mappedParts: string[], returns: ReturnTypesType): `scalar.${string}` | undefined => {
  if (mappedParts.length === 0) {
    return;
  }
  const oKey = mappedParts[0];
  const returnP1 = returns[oKey];
  if (typeof returnP1 === 'object') {
    const returnP2 = returnP1[mappedParts[1]];
    if (returnP2) {
      return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
    }
    return undefined;
  }
  return returnP1 as `scalar.${string}` | undefined;
};

export const PrepareScalarPaths = ({ ops, returns }: { returns: ReturnTypesType; ops: Operations }) => {
  const ibb = (
    k: string,
    originalKey: string,
    o: InputValueType | VType,
    p: string[] = [],
    pOriginals: string[] = [],
    root = true,
  ): { [x: string]: `scalar.${string}` } | undefined => {
    if (!o) {
      return;
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string') {
      const extractionArray = [...pOriginals, originalKey];
      const isScalar = ExtractScalar(extractionArray, returns);
      if (isScalar?.startsWith('scalar')) {
        const partOfTree = {
          [[...p, k].join(SEPARATOR)]: isScalar,
        };
        return partOfTree;
      }
      return {};
    }
    if (Array.isArray(o)) {
      return ibb(k, k, o[1], p, pOriginals, false);
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(alias, operationName, operation, p, pOriginals, false);
        })
        .reduce((a, b) => ({
          ...a,
          ...b,
        }));
    }
    const keyName = root ? ops[k] : k;
    return Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map(([k, v]) => {
        // Inline fragments shouldn't be added to the path as they aren't a field
        const isInlineFragment = originalKey.match(/^...\s*on/) != null;
        return ibb(
          k,
          k,
          v,
          isInlineFragment ? p : [...p, purifyGraphQLKey(keyName || k)],
          isInlineFragment ? pOriginals : [...pOriginals, purifyGraphQLKey(originalKey)],
          false,
        );
      })
      .reduce((a, b) => ({
        ...a,
        ...b,
      }));
  };
  return ibb;
};

export const purifyGraphQLKey = (k: string) => k.replace(/\([^)]*\)/g, '').replace(/^[^:]*\:/g, '');

const mapPart = (p: string) => {
  const [isArg, isField] = p.split('<>');
  if (isField) {
    return {
      v: isField,
      __type: 'field',
    } as const;
  }
  return {
    v: isArg,
    __type: 'arg',
  } as const;
};

type Part = ReturnType<typeof mapPart>;

export const ResolveFromPath = (props: AllTypesPropsType, returns: ReturnTypesType, ops: Operations) => {
  const ResolvePropsType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
    if (propsP1 === 'enum' && mappedParts.length === 1) {
      return 'enum';
    }
    if (typeof propsP1 === 'string' && propsP1.startsWith('scalar.') && mappedParts.length === 1) {
      return propsP1;
    }
    if (typeof propsP1 === 'object') {
      if (mappedParts.length < 2) {
        return 'not';
      }
      const propsP2 = propsP1[mappedParts[1].v];
      if (typeof propsP2 === 'string') {
        return rpp(
          `${propsP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
      if (typeof propsP2 === 'object') {
        if (mappedParts.length < 3) {
          return 'not';
        }
        const propsP3 = propsP2[mappedParts[2].v];
        if (propsP3 && mappedParts[2].__type === 'arg') {
          return rpp(
            `${propsP3}${SEPARATOR}${mappedParts
              .slice(3)
              .map((mp) => mp.v)
              .join(SEPARATOR)}`,
          );
        }
      }
    }
  };
  const ResolveReturnType = (mappedParts: Part[]) => {
    if (mappedParts.length === 0) {
      return 'not';
    }
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === 'object') {
      if (mappedParts.length < 2) return 'not';
      const returnP2 = returnP1[mappedParts[1].v];
      if (returnP2) {
        return rpp(
          `${returnP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
    }
  };
  const rpp = (path: string): 'enum' | 'not' | `scalar.${string}` => {
    const parts = path.split(SEPARATOR).filter((l) => l.length > 0);
    const mappedParts = parts.map(mapPart);
    const propsP1 = ResolvePropsType(mappedParts);
    if (propsP1) {
      return propsP1;
    }
    const returnP1 = ResolveReturnType(mappedParts);
    if (returnP1) {
      return returnP1;
    }
    return 'not';
  };
  return rpp;
};

export const InternalArgsBuilt = ({
  props,
  ops,
  returns,
  scalars,
  vars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  scalars?: ScalarDefinition;
  vars: Array<{ name: string; graphQLType: string }>;
}) => {
  const arb = (a: ZeusArgsType, p = '', root = true): string => {
    if (typeof a === 'string') {
      if (a.startsWith(START_VAR_NAME)) {
        const [varName, graphQLType] = a.replace(START_VAR_NAME, '$').split(GRAPHQL_TYPE_SEPARATOR);
        const v = vars.find((v) => v.name === varName);
        if (!v) {
          vars.push({
            name: varName,
            graphQLType,
          });
        } else {
          if (v.graphQLType !== graphQLType) {
            throw new Error(
              `Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`,
            );
          }
        }
        return varName;
      }
    }
    const checkType = ResolveFromPath(props, returns, ops)(p);
    if (checkType.startsWith('scalar.')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...splittedScalar] = checkType.split('.');
      const scalarKey = splittedScalar.join('.');
      return (scalars?.[scalarKey]?.encode?.(a) as string) || JSON.stringify(a);
    }
    if (Array.isArray(a)) {
      return `[${a.map((arr) => arb(arr, p, false)).join(', ')}]`;
    }
    if (typeof a === 'string') {
      if (checkType === 'enum') {
        return a;
      }
      return `${JSON.stringify(a)}`;
    }
    if (typeof a === 'object') {
      if (a === null) {
        return `null`;
      }
      const returnedObjectString = Object.entries(a)
        .filter(([, v]) => typeof v !== 'undefined')
        .map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`)
        .join(',\n');
      if (!root) {
        return `{${returnedObjectString}}`;
      }
      return returnedObjectString;
    }
    return `${a}`;
  };
  return arb;
};

export const resolverFor = <X, T extends keyof ResolverInputTypes, Z extends keyof ResolverInputTypes[T]>(
  type: T,
  field: Z,
  fn: (
    args: Required<ResolverInputTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : never,
) => fn as (args?: any, source?: any) => ReturnType<typeof fn>;

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<UnwrapPromise<ReturnType<T>>>;
export type ZeusHook<
  T extends (...args: any[]) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>,
> = ZeusState<ReturnType<T>[N]>;

export type WithTypeNameValue<T> = T & {
  __typename?: boolean;
  __directives?: string;
};
export type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
export type ScalarDefinition = Record<string, ScalarResolver>;

type IsScalar<S, SCLR extends ScalarDefinition> = S extends 'scalar' & { name: infer T }
  ? T extends keyof SCLR
    ? SCLR[T]['decode'] extends (s: unknown) => unknown
      ? ReturnType<SCLR[T]['decode']>
      : unknown
    : unknown
  : S;
type IsArray<T, U, SCLR extends ScalarDefinition> = T extends Array<infer R>
  ? InputType<R, U, SCLR>[]
  : InputType<T, U, SCLR>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string | Variable<any, string>;

type IsInterfaced<SRC extends DeepAnify<DST>, DST, SCLR extends ScalarDefinition> = FlattenArray<SRC> extends
  | ZEUS_INTERFACES
  | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P], SCLR>
          : IsArray<R, '__typename' extends keyof DST ? { __typename: true } : Record<string, never>, SCLR>
        : never;
    }[keyof SRC] & {
      [P in keyof Omit<
        Pick<
          SRC,
          {
            [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
          }[keyof DST]
        >,
        '__typename'
      >]: IsPayLoad<DST[P]> extends BaseZeusResolver ? IsScalar<SRC[P], SCLR> : IsArray<SRC[P], DST[P], SCLR>;
    }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends BaseZeusResolver
        ? IsScalar<SRC[P], SCLR>
        : IsArray<SRC[P], DST[P], SCLR>;
    };

export type MapType<SRC, DST, SCLR extends ScalarDefinition> = SRC extends DeepAnify<DST>
  ? IsInterfaced<SRC, DST, SCLR>
  : never;
// eslint-disable-next-line @typescript-eslint/ban-types
export type InputType<SRC, DST, SCLR extends ScalarDefinition = {}> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P], SCLR>[keyof MapType<SRC, R[P], SCLR>];
    } & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>, SCLR>
  : MapType<SRC, IsPayLoad<DST>, SCLR>;
export type SubscriptionToGraphQL<Z, T, SCLR extends ScalarDefinition> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z, SCLR>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z, SCLR>; errors?: string[] }) => void) => void;
  open: () => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type FromSelector<SELECTOR, NAME extends keyof GraphQLTypes, SCLR extends ScalarDefinition = {}> = InputType<
  GraphQLTypes[NAME],
  SELECTOR,
  SCLR
>;

export type ScalarResolver = {
  encode?: (s: unknown) => string;
  decode?: (s: unknown) => unknown;
};

export type SelectionFunction<V> = <Z extends V>(
  t: Z & {
    [P in keyof Z]: P extends keyof V ? Z[P] : never;
  },
) => Z;

type BuiltInVariableTypes = {
  ['String']: string;
  ['Int']: number;
  ['Float']: number;
  ['Boolean']: boolean;
};
type AllVariableTypes = keyof BuiltInVariableTypes | keyof ZEUS_VARIABLES;
type VariableRequired<T extends string> = `${T}!` | T | `[${T}]` | `[${T}]!` | `[${T}!]` | `[${T}!]!`;
type VR<T extends string> = VariableRequired<VariableRequired<T>>;

export type GraphQLVariableType = VR<AllVariableTypes>;

type ExtractVariableTypeString<T extends string> = T extends VR<infer R1>
  ? R1 extends VR<infer R2>
    ? R2 extends VR<infer R3>
      ? R3 extends VR<infer R4>
        ? R4 extends VR<infer R5>
          ? R5
          : R4
        : R3
      : R2
    : R1
  : T;

type DecomposeType<T, Type> = T extends `[${infer R}]`
  ? Array<DecomposeType<R, Type>> | undefined
  : T extends `${infer R}!`
  ? NonNullable<DecomposeType<R, Type>>
  : Type | undefined;

type ExtractTypeFromGraphQLType<T extends string> = T extends keyof ZEUS_VARIABLES
  ? ZEUS_VARIABLES[T]
  : T extends keyof BuiltInVariableTypes
  ? BuiltInVariableTypes[T]
  : any;

export type GetVariableType<T extends string> = DecomposeType<
  T,
  ExtractTypeFromGraphQLType<ExtractVariableTypeString<T>>
>;

type UndefinedKeys<T> = {
  [K in keyof T]-?: T[K] extends NonNullable<T[K]> ? never : K;
}[keyof T];

type WithNullableKeys<T> = Pick<T, UndefinedKeys<T>>;
type WithNonNullableKeys<T> = Omit<T, UndefinedKeys<T>>;

type OptionalKeys<T> = {
  [P in keyof T]?: T[P];
};

export type WithOptionalNullables<T> = OptionalKeys<WithNullableKeys<T>> & WithNonNullableKeys<T>;

export type ComposableSelector<T extends keyof ValueTypes> = ReturnType<SelectionFunction<ValueTypes[T]>>;

export type Variable<T extends GraphQLVariableType, Name extends string> = {
  ' __zeus_name': Name;
  ' __zeus_type': T;
};

export type ExtractVariablesDeep<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariablesDeep<Query[K]>> }[keyof Query]>;

export type ExtractVariables<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends [infer Inputs, infer Outputs]
  ? ExtractVariablesDeep<Inputs> & ExtractVariables<Outputs>
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariables<Query[K]>> }[keyof Query]>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const START_VAR_NAME = `$ZEUS_VAR`;
export const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;

export const $ = <Type extends GraphQLVariableType, Name extends string>(name: Name, graphqlType: Type) => {
  return (START_VAR_NAME + name + GRAPHQL_TYPE_SEPARATOR + graphqlType) as unknown as Variable<Type, Name>;
};
type ZEUS_INTERFACES = never
export type ScalarCoders = {
	DateTime?: ScalarResolver;
	JSONObject?: ScalarResolver;
	ID?: ScalarResolver;
}
type ZEUS_UNIONS = never

export type ValueTypes = {
    ["AssignmentEntity"]: AliasType<{
	class?:ValueTypes["ClassEntity"],
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	dueDate?:boolean | `@${string}`,
	educators?:ValueTypes["EducatorProfileDto"],
	id?:boolean | `@${string}`,
	lessons?:ValueTypes["LessonEntity"],
	name?:boolean | `@${string}`,
	students?:ValueTypes["StudentProfileDto"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["AssignmentSubmissionEntity"]: AliasType<{
	assignment?:ValueTypes["AssignmentEntity"],
	createdAt?:boolean | `@${string}`,
	feedback?:boolean | `@${string}`,
	grade?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	student?:ValueTypes["StudentProfileDto"],
	submissionContent?:boolean | `@${string}`,
	submittedAt?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["AuthTokens"]: AliasType<{
	accessToken?:boolean | `@${string}`,
	refreshToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ClassByYearSubjectInput"]: {
	pagination?: ValueTypes["PaginationInput"] | undefined | null | Variable<any, string>,
	subjectId: ValueTypes["ID"] | Variable<any, string>,
	withEducators: boolean | Variable<any, string>,
	withStudents: boolean | Variable<any, string>,
	yearGroupId: ValueTypes["ID"] | Variable<any, string>
};
	["ClassEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	educators?:ValueTypes["EducatorProfileDto"],
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	students?:ValueTypes["StudentProfileDto"],
	subject?:ValueTypes["SubjectEntity"],
	updatedAt?:boolean | `@${string}`,
	yearGroup?:ValueTypes["YearGroupEntity"],
		__typename?: boolean | `@${string}`
}>;
	["CreateAssignmentInput"]: {
	classId: ValueTypes["ID"] | Variable<any, string>,
	description?: string | undefined | null | Variable<any, string>,
	dueDate?: ValueTypes["DateTime"] | undefined | null | Variable<any, string>,
	name: string | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>
};
	["CreateAssignmentSubmissionInput"]: {
	assignmentId: ValueTypes["ID"] | Variable<any, string>,
	feedback?: string | undefined | null | Variable<any, string>,
	grade?: string | undefined | null | Variable<any, string>,
	studentId: ValueTypes["ID"] | Variable<any, string>,
	submissionContent?: string | undefined | null | Variable<any, string>,
	submittedAt?: ValueTypes["DateTime"] | undefined | null | Variable<any, string>
};
	["CreateClassInput"]: {
	name: string | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>
};
	["CreateEducatorProfileInput"]: {
	staffId: number | Variable<any, string>
};
	["CreateKeyStageInput"]: {
	description?: string | undefined | null | Variable<any, string>,
	name: string | Variable<any, string>
};
	["CreateLessonInput"]: {
	content?: ValueTypes["JSONObject"] | undefined | null | Variable<any, string>,
	createdByEducatorId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	description?: string | undefined | null | Variable<any, string>,
	recommendedYearGroupIds?: Array<ValueTypes["ID"] | undefined | null> | undefined | null | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>,
	title: string | Variable<any, string>
};
	["CreateMultipleChoiceQuestionInput"]: {
	correctAnswer: string | Variable<any, string>,
	lessonId: ValueTypes["ID"] | Variable<any, string>,
	options: Array<string> | Variable<any, string>,
	quizId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>,
	text: string | Variable<any, string>
};
	["CreatePermissionGroupInput"]: {
	description: string | Variable<any, string>,
	name: string | Variable<any, string>
};
	["CreatePermissionInput"]: {
	description?: string | undefined | null | Variable<any, string>,
	name: string | Variable<any, string>
};
	["CreateQuizInput"]: {
	description?: string | undefined | null | Variable<any, string>,
	lessonId: ValueTypes["ID"] | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>,
	title: string | Variable<any, string>
};
	["CreateRoleInput"]: {
	description?: string | undefined | null | Variable<any, string>,
	name: string | Variable<any, string>
};
	["CreateStudentProfileInput"]: {
	schoolYear: number | Variable<any, string>,
	studentId: number | Variable<any, string>
};
	["CreateSubjectInput"]: {
	name: string | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>
};
	["CreateTopicInput"]: {
	name: string | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>
};
	["CreateUserRequestDto"]: {
	addressLine1?: string | undefined | null | Variable<any, string>,
	addressLine2?: string | undefined | null | Variable<any, string>,
	city?: string | undefined | null | Variable<any, string>,
	country?: string | undefined | null | Variable<any, string>,
	county?: string | undefined | null | Variable<any, string>,
	dateOfBirth?: ValueTypes["DateTime"] | undefined | null | Variable<any, string>,
	email: string | Variable<any, string>,
	firstName: string | Variable<any, string>,
	lastName: string | Variable<any, string>,
	password: string | Variable<any, string>,
	phoneNumber?: string | undefined | null | Variable<any, string>,
	postalCode?: string | undefined | null | Variable<any, string>,
	userType: string | Variable<any, string>
};
	["CreateUserWithProfileInput"]: {
	addressLine1?: string | undefined | null | Variable<any, string>,
	addressLine2?: string | undefined | null | Variable<any, string>,
	city?: string | undefined | null | Variable<any, string>,
	country?: string | undefined | null | Variable<any, string>,
	county?: string | undefined | null | Variable<any, string>,
	dateOfBirth?: ValueTypes["DateTime"] | undefined | null | Variable<any, string>,
	educatorProfile?: ValueTypes["CreateEducatorProfileInput"] | undefined | null | Variable<any, string>,
	email: string | Variable<any, string>,
	firstName: string | Variable<any, string>,
	lastName: string | Variable<any, string>,
	password: string | Variable<any, string>,
	phoneNumber?: string | undefined | null | Variable<any, string>,
	postalCode?: string | undefined | null | Variable<any, string>,
	studentProfile?: ValueTypes["CreateStudentProfileInput"] | undefined | null | Variable<any, string>,
	userType: string | Variable<any, string>
};
	["CreateYearGroupInput"]: {
	keyStageId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	year: ValueTypes["ValidYear"] | Variable<any, string>
};
	/** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
["DateTime"]:unknown;
	["EducatorProfileDto"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	staffId?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["FilterInput"]: {
	/** Column (property) name to filter on */
	column: string | Variable<any, string>,
	/** Exact value the column must equal */
	value: string | Variable<any, string>
};
	["FindAllInput"]: {
	/** Set to true to return all records, ignoring pagination values */
	all?: boolean | undefined | null | Variable<any, string>,
	/** Column/value pairs to filter by (records must satisfy **all** filters) */
	filters?: Array<ValueTypes["FilterInput"]> | undefined | null | Variable<any, string>,
	/** Maximum number of records to return */
	limit?: number | undefined | null | Variable<any, string>,
	/** Number of records to skip */
	offset?: number | undefined | null | Variable<any, string>,
	/** Names of relations to eager-load (e.g. ["keyStage", "author"]) */
	relations?: Array<string> | undefined | null | Variable<any, string>
};
	["FindOneByInput"]: {
	column: string | Variable<any, string>,
	/** Relations to eager-load with this single record */
	relations?: Array<string> | undefined | null | Variable<any, string>,
	value: string | Variable<any, string>
};
	["IdInput"]: {
	id: number | Variable<any, string>,
	/** Relations to eager-load with this single record */
	relations?: Array<string> | undefined | null | Variable<any, string>
};
	["IdRequestDto"]: {
	id: number | Variable<any, string>
};
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:unknown;
	["KeyStageEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	stage?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
	yearGroups?:ValueTypes["YearGroupEntity"],
		__typename?: boolean | `@${string}`
}>;
	["LessonEntity"]: AliasType<{
	content?:boolean | `@${string}`,
	createdAt?:boolean | `@${string}`,
	createdBy?:ValueTypes["EducatorProfileDto"],
	createdById?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	multipleChoiceQuestions?:ValueTypes["MultipleChoiceQuestionEntity"],
	quizzes?:ValueTypes["QuizEntity"],
	recommendedYearGroups?:ValueTypes["YearGroupEntity"],
	subject?:ValueTypes["SubjectEntity"],
	title?:boolean | `@${string}`,
	topic?:ValueTypes["TopicEntity"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["LoginRequest"]: {
	email: string | Variable<any, string>,
	password: string | Variable<any, string>
};
	["LoginResponse"]: AliasType<{
	accessToken?:boolean | `@${string}`,
	refreshToken?:boolean | `@${string}`,
	userDetails?:ValueTypes["UserDetails"],
		__typename?: boolean | `@${string}`
}>;
	["MultipleChoiceQuestionEntity"]: AliasType<{
	correctAnswer?:boolean | `@${string}`,
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lesson?:ValueTypes["LessonEntity"],
	options?:boolean | `@${string}`,
	quiz?:ValueTypes["QuizEntity"],
	text?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Mutation"]: AliasType<{
createAssignment?: [{	data: ValueTypes["CreateAssignmentInput"] | Variable<any, string>},ValueTypes["AssignmentEntity"]],
createAssignmentSubmission?: [{	data: ValueTypes["CreateAssignmentSubmissionInput"] | Variable<any, string>},ValueTypes["AssignmentSubmissionEntity"]],
createClass?: [{	data: ValueTypes["CreateClassInput"] | Variable<any, string>},ValueTypes["ClassEntity"]],
createEducatorProfile?: [{	data: ValueTypes["CreateEducatorProfileInput"] | Variable<any, string>},ValueTypes["EducatorProfileDto"]],
createKeyStage?: [{	data: ValueTypes["CreateKeyStageInput"] | Variable<any, string>},ValueTypes["KeyStageEntity"]],
createLesson?: [{	data: ValueTypes["CreateLessonInput"] | Variable<any, string>},ValueTypes["LessonEntity"]],
createMultipleChoiceQuestion?: [{	data: ValueTypes["CreateMultipleChoiceQuestionInput"] | Variable<any, string>},ValueTypes["MultipleChoiceQuestionEntity"]],
createPermission?: [{	data: ValueTypes["CreatePermissionInput"] | Variable<any, string>},ValueTypes["Permission"]],
createPermissionGroup?: [{	data: ValueTypes["CreatePermissionGroupInput"] | Variable<any, string>},ValueTypes["PermissionGroup"]],
createQuiz?: [{	data: ValueTypes["CreateQuizInput"] | Variable<any, string>},ValueTypes["QuizEntity"]],
createRole?: [{	data: ValueTypes["CreateRoleInput"] | Variable<any, string>},ValueTypes["Role"]],
createStudentProfile?: [{	data: ValueTypes["CreateStudentProfileInput"] | Variable<any, string>},ValueTypes["StudentProfileDto"]],
createSubject?: [{	data: ValueTypes["CreateSubjectInput"] | Variable<any, string>},ValueTypes["SubjectEntity"]],
createTopic?: [{	data: ValueTypes["CreateTopicInput"] | Variable<any, string>},ValueTypes["TopicEntity"]],
createUser?: [{	data: ValueTypes["CreateUserRequestDto"] | Variable<any, string>},ValueTypes["User"]],
createUserWithProfile?: [{	data: ValueTypes["CreateUserWithProfileInput"] | Variable<any, string>},ValueTypes["User"]],
createYearGroup?: [{	data: ValueTypes["CreateYearGroupInput"] | Variable<any, string>},ValueTypes["YearGroupEntity"]],
deleteAssignment?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteAssignmentSubmission?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteClass?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteEducatorProfile?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteKeyStage?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteLesson?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteMultipleChoiceQuestion?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deletePermission?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deletePermissionGroup?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteQuiz?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteRole?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteStudentProfile?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteSubject?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteTopic?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
deleteYearGroup?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},boolean | `@${string}`],
logUserInWithEmailAndPassword?: [{	data: ValueTypes["LoginRequest"] | Variable<any, string>},ValueTypes["AuthTokens"]],
refreshUsersTokens?: [{	refreshToken: string | Variable<any, string>},ValueTypes["LoginResponse"]],
registerNewUserLocally?: [{	data: ValueTypes["CreateUserRequestDto"] | Variable<any, string>},ValueTypes["User"]],
removeUserByPublicId?: [{	data: ValueTypes["PublicIdRequestDto"] | Variable<any, string>},ValueTypes["User"]],
updateAssignment?: [{	data: ValueTypes["UpdateAssignmentInput"] | Variable<any, string>},ValueTypes["AssignmentEntity"]],
updateAssignmentSubmission?: [{	data: ValueTypes["UpdateAssignmentSubmissionInput"] | Variable<any, string>},ValueTypes["AssignmentSubmissionEntity"]],
updateClass?: [{	data: ValueTypes["UpdateClassInput"] | Variable<any, string>},ValueTypes["ClassEntity"]],
updateEducatorProfile?: [{	data: ValueTypes["UpdateEducatorProfileInput"] | Variable<any, string>},ValueTypes["EducatorProfileDto"]],
updateKeyStage?: [{	data: ValueTypes["UpdateKeyStageInput"] | Variable<any, string>},ValueTypes["KeyStageEntity"]],
updateLesson?: [{	data: ValueTypes["UpdateLessonInput"] | Variable<any, string>},ValueTypes["LessonEntity"]],
updateMultipleChoiceQuestion?: [{	data: ValueTypes["UpdateMultipleChoiceQuestionInput"] | Variable<any, string>},ValueTypes["MultipleChoiceQuestionEntity"]],
updatePermission?: [{	data: ValueTypes["UpdatePermissionInput"] | Variable<any, string>},ValueTypes["Permission"]],
updatePermissionGroup?: [{	data: ValueTypes["UpdatePermissionGroupInput"] | Variable<any, string>},ValueTypes["PermissionGroup"]],
updatePermissionGroupPermissionsFromArray?: [{	data: ValueTypes["SubmitIdArrayByIdRequestDto"] | Variable<any, string>},ValueTypes["PermissionGroup"]],
updatePermissionGroupsForRole?: [{	data: ValueTypes["SubmitIdArrayByIdRequestDto"] | Variable<any, string>},ValueTypes["Role"]],
updateQuiz?: [{	data: ValueTypes["UpdateQuizInput"] | Variable<any, string>},ValueTypes["QuizEntity"]],
updateRole?: [{	data: ValueTypes["UpdateRoleInput"] | Variable<any, string>},ValueTypes["Role"]],
updateStudentProfile?: [{	data: ValueTypes["UpdateStudentProfileInput"] | Variable<any, string>},ValueTypes["StudentProfileDto"]],
updateSubject?: [{	data: ValueTypes["UpdateSubjectInput"] | Variable<any, string>},ValueTypes["SubjectEntity"]],
updateTopic?: [{	data: ValueTypes["UpdateTopicInput"] | Variable<any, string>},ValueTypes["TopicEntity"]],
updateUserByPublicId?: [{	data: ValueTypes["UpdateUserWithProfileInput"] | Variable<any, string>,	publicId: string | Variable<any, string>},ValueTypes["User"]],
updateUserRolesFromArray?: [{	data: ValueTypes["UpdateUserRolesFromArrayRequestDto"] | Variable<any, string>},ValueTypes["User"]],
updateYearGroup?: [{	data: ValueTypes["UpdateYearGroupInput"] | Variable<any, string>},ValueTypes["YearGroupEntity"]],
		__typename?: boolean | `@${string}`
}>;
	["PageInfo"]: AliasType<{
	hasNextPage?:boolean | `@${string}`,
	hasPreviousPage?:boolean | `@${string}`,
	itemCount?:boolean | `@${string}`,
	page?:boolean | `@${string}`,
	pageCount?:boolean | `@${string}`,
	take?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedGetAllRequestDto"]: {
	limit?: number | undefined | null | Variable<any, string>,
	offset?: number | undefined | null | Variable<any, string>
};
	["PaginationInput"]: {
	page: number | Variable<any, string>,
	take: number | Variable<any, string>
};
	["Permission"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	permissionGroups?:ValueTypes["PermissionGroup"],
	roles?:ValueTypes["Role"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PermissionDTO"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PermissionGroup"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	permissions?:ValueTypes["Permission"],
	roles?:ValueTypes["Role"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PublicIdRequestDto"]: {
	publicId: string | Variable<any, string>
};
	["Query"]: AliasType<{
classesByYearAndSubject?: [{	input: ValueTypes["ClassByYearSubjectInput"] | Variable<any, string>},ValueTypes["ClassEntity"]],
getAllAssignment?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["AssignmentEntity"]],
getAllAssignmentSubmission?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["AssignmentSubmissionEntity"]],
getAllClass?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["ClassEntity"]],
getAllEducatorProfile?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["EducatorProfileDto"]],
getAllKeyStage?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["KeyStageEntity"]],
getAllLesson?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["LessonEntity"]],
getAllMultipleChoiceQuestion?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["MultipleChoiceQuestionEntity"]],
getAllPermission?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["Permission"]],
getAllPermissionGroup?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["PermissionGroup"]],
getAllQuiz?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["QuizEntity"]],
getAllRole?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["Role"]],
getAllStudentProfile?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["StudentProfileDto"]],
getAllSubject?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["SubjectEntity"]],
getAllTopic?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["TopicEntity"]],
getAllUsers?: [{	data: ValueTypes["PaginatedGetAllRequestDto"] | Variable<any, string>},ValueTypes["User"]],
getAllYearGroup?: [{	data: ValueTypes["FindAllInput"] | Variable<any, string>},ValueTypes["YearGroupEntity"]],
getAssignment?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["AssignmentEntity"]],
getAssignmentBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["AssignmentEntity"]],
getAssignmentSubmission?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["AssignmentSubmissionEntity"]],
getAssignmentSubmissionBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["AssignmentSubmissionEntity"]],
getClass?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["ClassEntity"]],
getClassBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["ClassEntity"]],
getEducatorProfile?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["EducatorProfileDto"]],
getEducatorProfileBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["EducatorProfileDto"]],
getKeyStage?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["KeyStageEntity"]],
getKeyStageBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["KeyStageEntity"]],
getLesson?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["LessonEntity"]],
getLessonBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["LessonEntity"]],
getMultipleChoiceQuestion?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["MultipleChoiceQuestionEntity"]],
getMultipleChoiceQuestionBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["MultipleChoiceQuestionEntity"]],
getPermission?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["Permission"]],
getPermissionBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["Permission"]],
getPermissionGroup?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["PermissionGroup"]],
getPermissionGroupBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["PermissionGroup"]],
getPermissionGroupsForRole?: [{	data: ValueTypes["IdRequestDto"] | Variable<any, string>},ValueTypes["PermissionGroup"]],
getPermissionsForGroup?: [{	data: ValueTypes["IdRequestDto"] | Variable<any, string>},ValueTypes["Permission"]],
getQuiz?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["QuizEntity"]],
getQuizBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["QuizEntity"]],
getRole?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["Role"]],
getRoleBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["Role"]],
getRolesForUser?: [{	data: ValueTypes["PublicIdRequestDto"] | Variable<any, string>},ValueTypes["Role"]],
getStudentProfile?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["StudentProfileDto"]],
getStudentProfileBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["StudentProfileDto"]],
getSubject?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["SubjectEntity"]],
getSubjectBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["SubjectEntity"]],
getTopic?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["TopicEntity"]],
getTopicBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["TopicEntity"]],
getUserByPublicId?: [{	data: ValueTypes["PublicIdRequestDto"] | Variable<any, string>},ValueTypes["User"]],
getUsersRolesAndPermissions?: [{	data: ValueTypes["UserPermissionsInput"] | Variable<any, string>},ValueTypes["RolesPermissionsResponse"]],
getYearGroup?: [{	data: ValueTypes["IdInput"] | Variable<any, string>},ValueTypes["YearGroupEntity"]],
getYearGroupBy?: [{	data: ValueTypes["FindOneByInput"] | Variable<any, string>},ValueTypes["YearGroupEntity"]],
searchAssignment?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["AssignmentEntity"]],
searchAssignmentSubmission?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["AssignmentSubmissionEntity"]],
searchClass?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["ClassEntity"]],
searchEducatorProfile?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["EducatorProfileDto"]],
searchKeyStage?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["KeyStageEntity"]],
searchLesson?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["LessonEntity"]],
searchMultipleChoiceQuestion?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["MultipleChoiceQuestionEntity"]],
searchPermission?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["Permission"]],
searchPermissionGroup?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["PermissionGroup"]],
searchQuiz?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["QuizEntity"]],
searchRole?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["Role"]],
searchStudentProfile?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["StudentProfileDto"]],
searchSubject?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["SubjectEntity"]],
searchTopic?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["TopicEntity"]],
searchUsers?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["User"]],
searchYearGroup?: [{	data: ValueTypes["SearchInput"] | Variable<any, string>},ValueTypes["YearGroupEntity"]],
topicsByYearAndSubject?: [{	input: ValueTypes["TopicByYearSubjectInput"] | Variable<any, string>},ValueTypes["TopicEntity"]],
		__typename?: boolean | `@${string}`
}>;
	["QuizEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lesson?:ValueTypes["LessonEntity"],
	multipleChoiceQuestions?:ValueTypes["MultipleChoiceQuestionEntity"],
	title?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RelationIdsInput"]: {
	ids: Array<ValueTypes["ID"]> | Variable<any, string>,
	relation: string | Variable<any, string>
};
	["Role"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	permissionGroups?:ValueTypes["PermissionGroup"],
	permissions?:ValueTypes["Permission"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RoleDTO"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RolesPermissionsResponse"]: AliasType<{
	permissions?:ValueTypes["PermissionDTO"],
	roles?:ValueTypes["RoleDTO"],
		__typename?: boolean | `@${string}`
}>;
	["SearchInput"]: {
	columns: Array<string> | Variable<any, string>,
	filters?: Array<ValueTypes["FilterInput"]> | undefined | null | Variable<any, string>,
	limit?: number | undefined | null | Variable<any, string>,
	relations?: Array<string> | undefined | null | Variable<any, string>,
	search: string | Variable<any, string>
};
	["StudentProfileDto"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	schoolYear?:boolean | `@${string}`,
	studentId?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SubjectEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lessons?:ValueTypes["LessonEntity"],
	name?:boolean | `@${string}`,
	topics?:ValueTypes["TopicEntity"],
	updatedAt?:boolean | `@${string}`,
	yearGroups?:ValueTypes["YearGroupEntity"],
		__typename?: boolean | `@${string}`
}>;
	["SubmitIdArrayByIdRequestDto"]: {
	idArray: Array<number> | Variable<any, string>,
	recordId: number | Variable<any, string>
};
	["TopicByYearSubjectInput"]: {
	pagination?: ValueTypes["PaginationInput"] | undefined | null | Variable<any, string>,
	subjectId: ValueTypes["ID"] | Variable<any, string>,
	withLessons: boolean | Variable<any, string>,
	yearGroupId: ValueTypes["ID"] | Variable<any, string>
};
	["TopicEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lessons?:ValueTypes["LessonEntity"],
	name?:boolean | `@${string}`,
	subject?:ValueTypes["SubjectEntity"],
	updatedAt?:boolean | `@${string}`,
	yearGroup?:ValueTypes["YearGroupEntity"],
		__typename?: boolean | `@${string}`
}>;
	["UpdateAssignmentInput"]: {
	classId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	description?: string | undefined | null | Variable<any, string>,
	dueDate?: ValueTypes["DateTime"] | undefined | null | Variable<any, string>,
	id: ValueTypes["ID"] | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>
};
	["UpdateAssignmentSubmissionInput"]: {
	assignmentId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	feedback?: string | undefined | null | Variable<any, string>,
	grade?: string | undefined | null | Variable<any, string>,
	id: ValueTypes["ID"] | Variable<any, string>,
	studentId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	submissionContent?: string | undefined | null | Variable<any, string>,
	submittedAt?: ValueTypes["DateTime"] | undefined | null | Variable<any, string>
};
	["UpdateClassInput"]: {
	id: ValueTypes["ID"] | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>
};
	["UpdateEducatorProfileInput"]: {
	id: number | Variable<any, string>,
	staffId?: number | undefined | null | Variable<any, string>
};
	["UpdateKeyStageInput"]: {
	description?: string | undefined | null | Variable<any, string>,
	id: ValueTypes["ID"] | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>
};
	["UpdateLessonInput"]: {
	content?: ValueTypes["JSONObject"] | undefined | null | Variable<any, string>,
	createdByEducatorId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	description?: string | undefined | null | Variable<any, string>,
	id: ValueTypes["ID"] | Variable<any, string>,
	recommendedYearGroupIds?: Array<ValueTypes["ID"]> | undefined | null | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>
};
	["UpdateMultipleChoiceQuestionInput"]: {
	correctAnswer?: string | undefined | null | Variable<any, string>,
	id: ValueTypes["ID"] | Variable<any, string>,
	lessonId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	options?: Array<string> | undefined | null | Variable<any, string>,
	quizId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>,
	text?: string | undefined | null | Variable<any, string>
};
	["UpdatePermissionGroupInput"]: {
	description?: string | undefined | null | Variable<any, string>,
	id: number | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>
};
	["UpdatePermissionInput"]: {
	description?: string | undefined | null | Variable<any, string>,
	id: number | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>
};
	["UpdateQuizInput"]: {
	description?: string | undefined | null | Variable<any, string>,
	id: ValueTypes["ID"] | Variable<any, string>,
	lessonId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>
};
	["UpdateRoleInput"]: {
	description?: string | undefined | null | Variable<any, string>,
	id: number | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>
};
	["UpdateStudentProfileInput"]: {
	id: number | Variable<any, string>,
	schoolYear?: number | undefined | null | Variable<any, string>,
	studentId?: number | undefined | null | Variable<any, string>
};
	["UpdateSubjectInput"]: {
	id: ValueTypes["ID"] | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>
};
	["UpdateTopicInput"]: {
	id: ValueTypes["ID"] | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ValueTypes["RelationIdsInput"]> | undefined | null | Variable<any, string>
};
	["UpdateUserRolesFromArrayRequestDto"]: {
	publicId: string | Variable<any, string>,
	roleIds: Array<number> | Variable<any, string>
};
	["UpdateUserWithProfileInput"]: {
	addressLine1?: string | undefined | null | Variable<any, string>,
	addressLine2?: string | undefined | null | Variable<any, string>,
	city?: string | undefined | null | Variable<any, string>,
	country?: string | undefined | null | Variable<any, string>,
	county?: string | undefined | null | Variable<any, string>,
	dateOfBirth?: ValueTypes["DateTime"] | undefined | null | Variable<any, string>,
	educatorProfile?: ValueTypes["CreateEducatorProfileInput"] | undefined | null | Variable<any, string>,
	email: string | Variable<any, string>,
	firstName: string | Variable<any, string>,
	lastName: string | Variable<any, string>,
	phoneNumber?: string | undefined | null | Variable<any, string>,
	postalCode?: string | undefined | null | Variable<any, string>,
	publicId: string | Variable<any, string>,
	studentProfile?: ValueTypes["CreateStudentProfileInput"] | undefined | null | Variable<any, string>,
	userType: string | Variable<any, string>
};
	["UpdateYearGroupInput"]: {
	id: ValueTypes["ID"] | Variable<any, string>,
	keyStageId?: ValueTypes["ID"] | undefined | null | Variable<any, string>,
	year?: ValueTypes["ValidYear"] | undefined | null | Variable<any, string>
};
	["User"]: AliasType<{
	addressLine1?:boolean | `@${string}`,
	addressLine2?:boolean | `@${string}`,
	city?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	county?:boolean | `@${string}`,
	createdAt?:boolean | `@${string}`,
	dateOfBirth?:boolean | `@${string}`,
	educatorProfile?:ValueTypes["EducatorProfileDto"],
	email?:boolean | `@${string}`,
	firstName?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lastName?:boolean | `@${string}`,
	phoneNumber?:boolean | `@${string}`,
	postalCode?:boolean | `@${string}`,
	publicId?:boolean | `@${string}`,
	roles?:ValueTypes["Role"],
	studentProfile?:ValueTypes["StudentProfileDto"],
	updatedAt?:boolean | `@${string}`,
	userType?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserDetails"]: AliasType<{
	permissions?:boolean | `@${string}`,
	publicId?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserPermissionsInput"]: {
	publicId: string | Variable<any, string>
};
	/** National Curriculum Key Stage (3, 4 or 5) */
["ValidKeyStage"]:ValidKeyStage;
	["ValidYear"]:ValidYear;
	["YearGroupEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	keyStage?:ValueTypes["KeyStageEntity"],
	subjects?:ValueTypes["SubjectEntity"],
	topics?:ValueTypes["TopicEntity"],
	updatedAt?:boolean | `@${string}`,
	year?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ID"]:unknown
  }

export type ResolverInputTypes = {
    ["AssignmentEntity"]: AliasType<{
	class?:ResolverInputTypes["ClassEntity"],
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	dueDate?:boolean | `@${string}`,
	educators?:ResolverInputTypes["EducatorProfileDto"],
	id?:boolean | `@${string}`,
	lessons?:ResolverInputTypes["LessonEntity"],
	name?:boolean | `@${string}`,
	students?:ResolverInputTypes["StudentProfileDto"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["AssignmentSubmissionEntity"]: AliasType<{
	assignment?:ResolverInputTypes["AssignmentEntity"],
	createdAt?:boolean | `@${string}`,
	feedback?:boolean | `@${string}`,
	grade?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	student?:ResolverInputTypes["StudentProfileDto"],
	submissionContent?:boolean | `@${string}`,
	submittedAt?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["AuthTokens"]: AliasType<{
	accessToken?:boolean | `@${string}`,
	refreshToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ClassByYearSubjectInput"]: {
	pagination?: ResolverInputTypes["PaginationInput"] | undefined | null,
	subjectId: ResolverInputTypes["ID"],
	withEducators: boolean,
	withStudents: boolean,
	yearGroupId: ResolverInputTypes["ID"]
};
	["ClassEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	educators?:ResolverInputTypes["EducatorProfileDto"],
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	students?:ResolverInputTypes["StudentProfileDto"],
	subject?:ResolverInputTypes["SubjectEntity"],
	updatedAt?:boolean | `@${string}`,
	yearGroup?:ResolverInputTypes["YearGroupEntity"],
		__typename?: boolean | `@${string}`
}>;
	["CreateAssignmentInput"]: {
	classId: ResolverInputTypes["ID"],
	description?: string | undefined | null,
	dueDate?: ResolverInputTypes["DateTime"] | undefined | null,
	name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null
};
	["CreateAssignmentSubmissionInput"]: {
	assignmentId: ResolverInputTypes["ID"],
	feedback?: string | undefined | null,
	grade?: string | undefined | null,
	studentId: ResolverInputTypes["ID"],
	submissionContent?: string | undefined | null,
	submittedAt?: ResolverInputTypes["DateTime"] | undefined | null
};
	["CreateClassInput"]: {
	name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null
};
	["CreateEducatorProfileInput"]: {
	staffId: number
};
	["CreateKeyStageInput"]: {
	description?: string | undefined | null,
	name: string
};
	["CreateLessonInput"]: {
	content?: ResolverInputTypes["JSONObject"] | undefined | null,
	createdByEducatorId?: ResolverInputTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	recommendedYearGroupIds?: Array<ResolverInputTypes["ID"] | undefined | null> | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null,
	title: string
};
	["CreateMultipleChoiceQuestionInput"]: {
	correctAnswer: string,
	lessonId: ResolverInputTypes["ID"],
	options: Array<string>,
	quizId?: ResolverInputTypes["ID"] | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null,
	text: string
};
	["CreatePermissionGroupInput"]: {
	description: string,
	name: string
};
	["CreatePermissionInput"]: {
	description?: string | undefined | null,
	name: string
};
	["CreateQuizInput"]: {
	description?: string | undefined | null,
	lessonId: ResolverInputTypes["ID"],
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null,
	title: string
};
	["CreateRoleInput"]: {
	description?: string | undefined | null,
	name: string
};
	["CreateStudentProfileInput"]: {
	schoolYear: number,
	studentId: number
};
	["CreateSubjectInput"]: {
	name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null
};
	["CreateTopicInput"]: {
	name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null
};
	["CreateUserRequestDto"]: {
	addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	dateOfBirth?: ResolverInputTypes["DateTime"] | undefined | null,
	email: string,
	firstName: string,
	lastName: string,
	password: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	userType: string
};
	["CreateUserWithProfileInput"]: {
	addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	dateOfBirth?: ResolverInputTypes["DateTime"] | undefined | null,
	educatorProfile?: ResolverInputTypes["CreateEducatorProfileInput"] | undefined | null,
	email: string,
	firstName: string,
	lastName: string,
	password: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	studentProfile?: ResolverInputTypes["CreateStudentProfileInput"] | undefined | null,
	userType: string
};
	["CreateYearGroupInput"]: {
	keyStageId?: ResolverInputTypes["ID"] | undefined | null,
	year: ResolverInputTypes["ValidYear"]
};
	/** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
["DateTime"]:unknown;
	["EducatorProfileDto"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	staffId?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["FilterInput"]: {
	/** Column (property) name to filter on */
	column: string,
	/** Exact value the column must equal */
	value: string
};
	["FindAllInput"]: {
	/** Set to true to return all records, ignoring pagination values */
	all?: boolean | undefined | null,
	/** Column/value pairs to filter by (records must satisfy **all** filters) */
	filters?: Array<ResolverInputTypes["FilterInput"]> | undefined | null,
	/** Maximum number of records to return */
	limit?: number | undefined | null,
	/** Number of records to skip */
	offset?: number | undefined | null,
	/** Names of relations to eager-load (e.g. ["keyStage", "author"]) */
	relations?: Array<string> | undefined | null
};
	["FindOneByInput"]: {
	column: string,
	/** Relations to eager-load with this single record */
	relations?: Array<string> | undefined | null,
	value: string
};
	["IdInput"]: {
	id: number,
	/** Relations to eager-load with this single record */
	relations?: Array<string> | undefined | null
};
	["IdRequestDto"]: {
	id: number
};
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:unknown;
	["KeyStageEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	stage?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
	yearGroups?:ResolverInputTypes["YearGroupEntity"],
		__typename?: boolean | `@${string}`
}>;
	["LessonEntity"]: AliasType<{
	content?:boolean | `@${string}`,
	createdAt?:boolean | `@${string}`,
	createdBy?:ResolverInputTypes["EducatorProfileDto"],
	createdById?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	multipleChoiceQuestions?:ResolverInputTypes["MultipleChoiceQuestionEntity"],
	quizzes?:ResolverInputTypes["QuizEntity"],
	recommendedYearGroups?:ResolverInputTypes["YearGroupEntity"],
	subject?:ResolverInputTypes["SubjectEntity"],
	title?:boolean | `@${string}`,
	topic?:ResolverInputTypes["TopicEntity"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["LoginRequest"]: {
	email: string,
	password: string
};
	["LoginResponse"]: AliasType<{
	accessToken?:boolean | `@${string}`,
	refreshToken?:boolean | `@${string}`,
	userDetails?:ResolverInputTypes["UserDetails"],
		__typename?: boolean | `@${string}`
}>;
	["MultipleChoiceQuestionEntity"]: AliasType<{
	correctAnswer?:boolean | `@${string}`,
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lesson?:ResolverInputTypes["LessonEntity"],
	options?:boolean | `@${string}`,
	quiz?:ResolverInputTypes["QuizEntity"],
	text?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Mutation"]: AliasType<{
createAssignment?: [{	data: ResolverInputTypes["CreateAssignmentInput"]},ResolverInputTypes["AssignmentEntity"]],
createAssignmentSubmission?: [{	data: ResolverInputTypes["CreateAssignmentSubmissionInput"]},ResolverInputTypes["AssignmentSubmissionEntity"]],
createClass?: [{	data: ResolverInputTypes["CreateClassInput"]},ResolverInputTypes["ClassEntity"]],
createEducatorProfile?: [{	data: ResolverInputTypes["CreateEducatorProfileInput"]},ResolverInputTypes["EducatorProfileDto"]],
createKeyStage?: [{	data: ResolverInputTypes["CreateKeyStageInput"]},ResolverInputTypes["KeyStageEntity"]],
createLesson?: [{	data: ResolverInputTypes["CreateLessonInput"]},ResolverInputTypes["LessonEntity"]],
createMultipleChoiceQuestion?: [{	data: ResolverInputTypes["CreateMultipleChoiceQuestionInput"]},ResolverInputTypes["MultipleChoiceQuestionEntity"]],
createPermission?: [{	data: ResolverInputTypes["CreatePermissionInput"]},ResolverInputTypes["Permission"]],
createPermissionGroup?: [{	data: ResolverInputTypes["CreatePermissionGroupInput"]},ResolverInputTypes["PermissionGroup"]],
createQuiz?: [{	data: ResolverInputTypes["CreateQuizInput"]},ResolverInputTypes["QuizEntity"]],
createRole?: [{	data: ResolverInputTypes["CreateRoleInput"]},ResolverInputTypes["Role"]],
createStudentProfile?: [{	data: ResolverInputTypes["CreateStudentProfileInput"]},ResolverInputTypes["StudentProfileDto"]],
createSubject?: [{	data: ResolverInputTypes["CreateSubjectInput"]},ResolverInputTypes["SubjectEntity"]],
createTopic?: [{	data: ResolverInputTypes["CreateTopicInput"]},ResolverInputTypes["TopicEntity"]],
createUser?: [{	data: ResolverInputTypes["CreateUserRequestDto"]},ResolverInputTypes["User"]],
createUserWithProfile?: [{	data: ResolverInputTypes["CreateUserWithProfileInput"]},ResolverInputTypes["User"]],
createYearGroup?: [{	data: ResolverInputTypes["CreateYearGroupInput"]},ResolverInputTypes["YearGroupEntity"]],
deleteAssignment?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteAssignmentSubmission?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteClass?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteEducatorProfile?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteKeyStage?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteLesson?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteMultipleChoiceQuestion?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deletePermission?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deletePermissionGroup?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteQuiz?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteRole?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteStudentProfile?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteSubject?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteTopic?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
deleteYearGroup?: [{	data: ResolverInputTypes["IdInput"]},boolean | `@${string}`],
logUserInWithEmailAndPassword?: [{	data: ResolverInputTypes["LoginRequest"]},ResolverInputTypes["AuthTokens"]],
refreshUsersTokens?: [{	refreshToken: string},ResolverInputTypes["LoginResponse"]],
registerNewUserLocally?: [{	data: ResolverInputTypes["CreateUserRequestDto"]},ResolverInputTypes["User"]],
removeUserByPublicId?: [{	data: ResolverInputTypes["PublicIdRequestDto"]},ResolverInputTypes["User"]],
updateAssignment?: [{	data: ResolverInputTypes["UpdateAssignmentInput"]},ResolverInputTypes["AssignmentEntity"]],
updateAssignmentSubmission?: [{	data: ResolverInputTypes["UpdateAssignmentSubmissionInput"]},ResolverInputTypes["AssignmentSubmissionEntity"]],
updateClass?: [{	data: ResolverInputTypes["UpdateClassInput"]},ResolverInputTypes["ClassEntity"]],
updateEducatorProfile?: [{	data: ResolverInputTypes["UpdateEducatorProfileInput"]},ResolverInputTypes["EducatorProfileDto"]],
updateKeyStage?: [{	data: ResolverInputTypes["UpdateKeyStageInput"]},ResolverInputTypes["KeyStageEntity"]],
updateLesson?: [{	data: ResolverInputTypes["UpdateLessonInput"]},ResolverInputTypes["LessonEntity"]],
updateMultipleChoiceQuestion?: [{	data: ResolverInputTypes["UpdateMultipleChoiceQuestionInput"]},ResolverInputTypes["MultipleChoiceQuestionEntity"]],
updatePermission?: [{	data: ResolverInputTypes["UpdatePermissionInput"]},ResolverInputTypes["Permission"]],
updatePermissionGroup?: [{	data: ResolverInputTypes["UpdatePermissionGroupInput"]},ResolverInputTypes["PermissionGroup"]],
updatePermissionGroupPermissionsFromArray?: [{	data: ResolverInputTypes["SubmitIdArrayByIdRequestDto"]},ResolverInputTypes["PermissionGroup"]],
updatePermissionGroupsForRole?: [{	data: ResolverInputTypes["SubmitIdArrayByIdRequestDto"]},ResolverInputTypes["Role"]],
updateQuiz?: [{	data: ResolverInputTypes["UpdateQuizInput"]},ResolverInputTypes["QuizEntity"]],
updateRole?: [{	data: ResolverInputTypes["UpdateRoleInput"]},ResolverInputTypes["Role"]],
updateStudentProfile?: [{	data: ResolverInputTypes["UpdateStudentProfileInput"]},ResolverInputTypes["StudentProfileDto"]],
updateSubject?: [{	data: ResolverInputTypes["UpdateSubjectInput"]},ResolverInputTypes["SubjectEntity"]],
updateTopic?: [{	data: ResolverInputTypes["UpdateTopicInput"]},ResolverInputTypes["TopicEntity"]],
updateUserByPublicId?: [{	data: ResolverInputTypes["UpdateUserWithProfileInput"],	publicId: string},ResolverInputTypes["User"]],
updateUserRolesFromArray?: [{	data: ResolverInputTypes["UpdateUserRolesFromArrayRequestDto"]},ResolverInputTypes["User"]],
updateYearGroup?: [{	data: ResolverInputTypes["UpdateYearGroupInput"]},ResolverInputTypes["YearGroupEntity"]],
		__typename?: boolean | `@${string}`
}>;
	["PageInfo"]: AliasType<{
	hasNextPage?:boolean | `@${string}`,
	hasPreviousPage?:boolean | `@${string}`,
	itemCount?:boolean | `@${string}`,
	page?:boolean | `@${string}`,
	pageCount?:boolean | `@${string}`,
	take?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedGetAllRequestDto"]: {
	limit?: number | undefined | null,
	offset?: number | undefined | null
};
	["PaginationInput"]: {
	page: number,
	take: number
};
	["Permission"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	permissionGroups?:ResolverInputTypes["PermissionGroup"],
	roles?:ResolverInputTypes["Role"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PermissionDTO"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PermissionGroup"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	permissions?:ResolverInputTypes["Permission"],
	roles?:ResolverInputTypes["Role"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PublicIdRequestDto"]: {
	publicId: string
};
	["Query"]: AliasType<{
classesByYearAndSubject?: [{	input: ResolverInputTypes["ClassByYearSubjectInput"]},ResolverInputTypes["ClassEntity"]],
getAllAssignment?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["AssignmentEntity"]],
getAllAssignmentSubmission?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["AssignmentSubmissionEntity"]],
getAllClass?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["ClassEntity"]],
getAllEducatorProfile?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["EducatorProfileDto"]],
getAllKeyStage?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["KeyStageEntity"]],
getAllLesson?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["LessonEntity"]],
getAllMultipleChoiceQuestion?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["MultipleChoiceQuestionEntity"]],
getAllPermission?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["Permission"]],
getAllPermissionGroup?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["PermissionGroup"]],
getAllQuiz?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["QuizEntity"]],
getAllRole?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["Role"]],
getAllStudentProfile?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["StudentProfileDto"]],
getAllSubject?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["SubjectEntity"]],
getAllTopic?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["TopicEntity"]],
getAllUsers?: [{	data: ResolverInputTypes["PaginatedGetAllRequestDto"]},ResolverInputTypes["User"]],
getAllYearGroup?: [{	data: ResolverInputTypes["FindAllInput"]},ResolverInputTypes["YearGroupEntity"]],
getAssignment?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["AssignmentEntity"]],
getAssignmentBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["AssignmentEntity"]],
getAssignmentSubmission?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["AssignmentSubmissionEntity"]],
getAssignmentSubmissionBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["AssignmentSubmissionEntity"]],
getClass?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["ClassEntity"]],
getClassBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["ClassEntity"]],
getEducatorProfile?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["EducatorProfileDto"]],
getEducatorProfileBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["EducatorProfileDto"]],
getKeyStage?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["KeyStageEntity"]],
getKeyStageBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["KeyStageEntity"]],
getLesson?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["LessonEntity"]],
getLessonBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["LessonEntity"]],
getMultipleChoiceQuestion?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["MultipleChoiceQuestionEntity"]],
getMultipleChoiceQuestionBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["MultipleChoiceQuestionEntity"]],
getPermission?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["Permission"]],
getPermissionBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["Permission"]],
getPermissionGroup?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["PermissionGroup"]],
getPermissionGroupBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["PermissionGroup"]],
getPermissionGroupsForRole?: [{	data: ResolverInputTypes["IdRequestDto"]},ResolverInputTypes["PermissionGroup"]],
getPermissionsForGroup?: [{	data: ResolverInputTypes["IdRequestDto"]},ResolverInputTypes["Permission"]],
getQuiz?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["QuizEntity"]],
getQuizBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["QuizEntity"]],
getRole?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["Role"]],
getRoleBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["Role"]],
getRolesForUser?: [{	data: ResolverInputTypes["PublicIdRequestDto"]},ResolverInputTypes["Role"]],
getStudentProfile?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["StudentProfileDto"]],
getStudentProfileBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["StudentProfileDto"]],
getSubject?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["SubjectEntity"]],
getSubjectBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["SubjectEntity"]],
getTopic?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["TopicEntity"]],
getTopicBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["TopicEntity"]],
getUserByPublicId?: [{	data: ResolverInputTypes["PublicIdRequestDto"]},ResolverInputTypes["User"]],
getUsersRolesAndPermissions?: [{	data: ResolverInputTypes["UserPermissionsInput"]},ResolverInputTypes["RolesPermissionsResponse"]],
getYearGroup?: [{	data: ResolverInputTypes["IdInput"]},ResolverInputTypes["YearGroupEntity"]],
getYearGroupBy?: [{	data: ResolverInputTypes["FindOneByInput"]},ResolverInputTypes["YearGroupEntity"]],
searchAssignment?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["AssignmentEntity"]],
searchAssignmentSubmission?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["AssignmentSubmissionEntity"]],
searchClass?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["ClassEntity"]],
searchEducatorProfile?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["EducatorProfileDto"]],
searchKeyStage?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["KeyStageEntity"]],
searchLesson?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["LessonEntity"]],
searchMultipleChoiceQuestion?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["MultipleChoiceQuestionEntity"]],
searchPermission?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["Permission"]],
searchPermissionGroup?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["PermissionGroup"]],
searchQuiz?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["QuizEntity"]],
searchRole?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["Role"]],
searchStudentProfile?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["StudentProfileDto"]],
searchSubject?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["SubjectEntity"]],
searchTopic?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["TopicEntity"]],
searchUsers?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["User"]],
searchYearGroup?: [{	data: ResolverInputTypes["SearchInput"]},ResolverInputTypes["YearGroupEntity"]],
topicsByYearAndSubject?: [{	input: ResolverInputTypes["TopicByYearSubjectInput"]},ResolverInputTypes["TopicEntity"]],
		__typename?: boolean | `@${string}`
}>;
	["QuizEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lesson?:ResolverInputTypes["LessonEntity"],
	multipleChoiceQuestions?:ResolverInputTypes["MultipleChoiceQuestionEntity"],
	title?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RelationIdsInput"]: {
	ids: Array<ResolverInputTypes["ID"]>,
	relation: string
};
	["Role"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	permissionGroups?:ResolverInputTypes["PermissionGroup"],
	permissions?:ResolverInputTypes["Permission"],
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RoleDTO"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RolesPermissionsResponse"]: AliasType<{
	permissions?:ResolverInputTypes["PermissionDTO"],
	roles?:ResolverInputTypes["RoleDTO"],
		__typename?: boolean | `@${string}`
}>;
	["SearchInput"]: {
	columns: Array<string>,
	filters?: Array<ResolverInputTypes["FilterInput"]> | undefined | null,
	limit?: number | undefined | null,
	relations?: Array<string> | undefined | null,
	search: string
};
	["StudentProfileDto"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	schoolYear?:boolean | `@${string}`,
	studentId?:boolean | `@${string}`,
	updatedAt?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SubjectEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lessons?:ResolverInputTypes["LessonEntity"],
	name?:boolean | `@${string}`,
	topics?:ResolverInputTypes["TopicEntity"],
	updatedAt?:boolean | `@${string}`,
	yearGroups?:ResolverInputTypes["YearGroupEntity"],
		__typename?: boolean | `@${string}`
}>;
	["SubmitIdArrayByIdRequestDto"]: {
	idArray: Array<number>,
	recordId: number
};
	["TopicByYearSubjectInput"]: {
	pagination?: ResolverInputTypes["PaginationInput"] | undefined | null,
	subjectId: ResolverInputTypes["ID"],
	withLessons: boolean,
	yearGroupId: ResolverInputTypes["ID"]
};
	["TopicEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lessons?:ResolverInputTypes["LessonEntity"],
	name?:boolean | `@${string}`,
	subject?:ResolverInputTypes["SubjectEntity"],
	updatedAt?:boolean | `@${string}`,
	yearGroup?:ResolverInputTypes["YearGroupEntity"],
		__typename?: boolean | `@${string}`
}>;
	["UpdateAssignmentInput"]: {
	classId?: ResolverInputTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	dueDate?: ResolverInputTypes["DateTime"] | undefined | null,
	id: ResolverInputTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateAssignmentSubmissionInput"]: {
	assignmentId?: ResolverInputTypes["ID"] | undefined | null,
	feedback?: string | undefined | null,
	grade?: string | undefined | null,
	id: ResolverInputTypes["ID"],
	studentId?: ResolverInputTypes["ID"] | undefined | null,
	submissionContent?: string | undefined | null,
	submittedAt?: ResolverInputTypes["DateTime"] | undefined | null
};
	["UpdateClassInput"]: {
	id: ResolverInputTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateEducatorProfileInput"]: {
	id: number,
	staffId?: number | undefined | null
};
	["UpdateKeyStageInput"]: {
	description?: string | undefined | null,
	id: ResolverInputTypes["ID"],
	name?: string | undefined | null
};
	["UpdateLessonInput"]: {
	content?: ResolverInputTypes["JSONObject"] | undefined | null,
	createdByEducatorId?: ResolverInputTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	id: ResolverInputTypes["ID"],
	recommendedYearGroupIds?: Array<ResolverInputTypes["ID"]> | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null,
	title?: string | undefined | null
};
	["UpdateMultipleChoiceQuestionInput"]: {
	correctAnswer?: string | undefined | null,
	id: ResolverInputTypes["ID"],
	lessonId?: ResolverInputTypes["ID"] | undefined | null,
	options?: Array<string> | undefined | null,
	quizId?: ResolverInputTypes["ID"] | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null,
	text?: string | undefined | null
};
	["UpdatePermissionGroupInput"]: {
	description?: string | undefined | null,
	id: number,
	name?: string | undefined | null
};
	["UpdatePermissionInput"]: {
	description?: string | undefined | null,
	id: number,
	name?: string | undefined | null
};
	["UpdateQuizInput"]: {
	description?: string | undefined | null,
	id: ResolverInputTypes["ID"],
	lessonId?: ResolverInputTypes["ID"] | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null,
	title?: string | undefined | null
};
	["UpdateRoleInput"]: {
	description?: string | undefined | null,
	id: number,
	name?: string | undefined | null
};
	["UpdateStudentProfileInput"]: {
	id: number,
	schoolYear?: number | undefined | null,
	studentId?: number | undefined | null
};
	["UpdateSubjectInput"]: {
	id: ResolverInputTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateTopicInput"]: {
	id: ResolverInputTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ResolverInputTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateUserRolesFromArrayRequestDto"]: {
	publicId: string,
	roleIds: Array<number>
};
	["UpdateUserWithProfileInput"]: {
	addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	dateOfBirth?: ResolverInputTypes["DateTime"] | undefined | null,
	educatorProfile?: ResolverInputTypes["CreateEducatorProfileInput"] | undefined | null,
	email: string,
	firstName: string,
	lastName: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	publicId: string,
	studentProfile?: ResolverInputTypes["CreateStudentProfileInput"] | undefined | null,
	userType: string
};
	["UpdateYearGroupInput"]: {
	id: ResolverInputTypes["ID"],
	keyStageId?: ResolverInputTypes["ID"] | undefined | null,
	year?: ResolverInputTypes["ValidYear"] | undefined | null
};
	["User"]: AliasType<{
	addressLine1?:boolean | `@${string}`,
	addressLine2?:boolean | `@${string}`,
	city?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	county?:boolean | `@${string}`,
	createdAt?:boolean | `@${string}`,
	dateOfBirth?:boolean | `@${string}`,
	educatorProfile?:ResolverInputTypes["EducatorProfileDto"],
	email?:boolean | `@${string}`,
	firstName?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	lastName?:boolean | `@${string}`,
	phoneNumber?:boolean | `@${string}`,
	postalCode?:boolean | `@${string}`,
	publicId?:boolean | `@${string}`,
	roles?:ResolverInputTypes["Role"],
	studentProfile?:ResolverInputTypes["StudentProfileDto"],
	updatedAt?:boolean | `@${string}`,
	userType?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserDetails"]: AliasType<{
	permissions?:boolean | `@${string}`,
	publicId?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserPermissionsInput"]: {
	publicId: string
};
	/** National Curriculum Key Stage (3, 4 or 5) */
["ValidKeyStage"]:ValidKeyStage;
	["ValidYear"]:ValidYear;
	["YearGroupEntity"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	keyStage?:ResolverInputTypes["KeyStageEntity"],
	subjects?:ResolverInputTypes["SubjectEntity"],
	topics?:ResolverInputTypes["TopicEntity"],
	updatedAt?:boolean | `@${string}`,
	year?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["schema"]: AliasType<{
	query?:ResolverInputTypes["Query"],
	mutation?:ResolverInputTypes["Mutation"],
		__typename?: boolean | `@${string}`
}>;
	["ID"]:unknown
  }

export type ModelTypes = {
    ["AssignmentEntity"]: {
		class: ModelTypes["ClassEntity"],
	createdAt: ModelTypes["DateTime"],
	description?: string | undefined | null,
	dueDate?: ModelTypes["DateTime"] | undefined | null,
	educators?: Array<ModelTypes["EducatorProfileDto"]> | undefined | null,
	id: ModelTypes["ID"],
	lessons?: Array<ModelTypes["LessonEntity"]> | undefined | null,
	name: string,
	students?: Array<ModelTypes["StudentProfileDto"]> | undefined | null,
	updatedAt: ModelTypes["DateTime"]
};
	["AssignmentSubmissionEntity"]: {
		assignment: ModelTypes["AssignmentEntity"],
	createdAt: ModelTypes["DateTime"],
	feedback?: string | undefined | null,
	grade?: string | undefined | null,
	id: ModelTypes["ID"],
	student: ModelTypes["StudentProfileDto"],
	submissionContent?: string | undefined | null,
	submittedAt?: ModelTypes["DateTime"] | undefined | null,
	updatedAt: ModelTypes["DateTime"]
};
	["AuthTokens"]: {
		accessToken: string,
	refreshToken: string
};
	["ClassByYearSubjectInput"]: {
	pagination?: ModelTypes["PaginationInput"] | undefined | null,
	subjectId: ModelTypes["ID"],
	withEducators: boolean,
	withStudents: boolean,
	yearGroupId: ModelTypes["ID"]
};
	["ClassEntity"]: {
		createdAt: ModelTypes["DateTime"],
	educators?: Array<ModelTypes["EducatorProfileDto"]> | undefined | null,
	id: ModelTypes["ID"],
	name: string,
	students?: Array<ModelTypes["StudentProfileDto"]> | undefined | null,
	subject: ModelTypes["SubjectEntity"],
	updatedAt: ModelTypes["DateTime"],
	yearGroup: ModelTypes["YearGroupEntity"]
};
	["CreateAssignmentInput"]: {
	classId: ModelTypes["ID"],
	description?: string | undefined | null,
	dueDate?: ModelTypes["DateTime"] | undefined | null,
	name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null
};
	["CreateAssignmentSubmissionInput"]: {
	assignmentId: ModelTypes["ID"],
	feedback?: string | undefined | null,
	grade?: string | undefined | null,
	studentId: ModelTypes["ID"],
	submissionContent?: string | undefined | null,
	submittedAt?: ModelTypes["DateTime"] | undefined | null
};
	["CreateClassInput"]: {
	name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null
};
	["CreateEducatorProfileInput"]: {
	staffId: number
};
	["CreateKeyStageInput"]: {
	description?: string | undefined | null,
	name: string
};
	["CreateLessonInput"]: {
	content?: ModelTypes["JSONObject"] | undefined | null,
	createdByEducatorId?: ModelTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	recommendedYearGroupIds?: Array<ModelTypes["ID"] | undefined | null> | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null,
	title: string
};
	["CreateMultipleChoiceQuestionInput"]: {
	correctAnswer: string,
	lessonId: ModelTypes["ID"],
	options: Array<string>,
	quizId?: ModelTypes["ID"] | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null,
	text: string
};
	["CreatePermissionGroupInput"]: {
	description: string,
	name: string
};
	["CreatePermissionInput"]: {
	description?: string | undefined | null,
	name: string
};
	["CreateQuizInput"]: {
	description?: string | undefined | null,
	lessonId: ModelTypes["ID"],
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null,
	title: string
};
	["CreateRoleInput"]: {
	description?: string | undefined | null,
	name: string
};
	["CreateStudentProfileInput"]: {
	schoolYear: number,
	studentId: number
};
	["CreateSubjectInput"]: {
	name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null
};
	["CreateTopicInput"]: {
	name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null
};
	["CreateUserRequestDto"]: {
	addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	dateOfBirth?: ModelTypes["DateTime"] | undefined | null,
	email: string,
	firstName: string,
	lastName: string,
	password: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	userType: string
};
	["CreateUserWithProfileInput"]: {
	addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	dateOfBirth?: ModelTypes["DateTime"] | undefined | null,
	educatorProfile?: ModelTypes["CreateEducatorProfileInput"] | undefined | null,
	email: string,
	firstName: string,
	lastName: string,
	password: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	studentProfile?: ModelTypes["CreateStudentProfileInput"] | undefined | null,
	userType: string
};
	["CreateYearGroupInput"]: {
	keyStageId?: ModelTypes["ID"] | undefined | null,
	year: ModelTypes["ValidYear"]
};
	/** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
["DateTime"]:any;
	["EducatorProfileDto"]: {
		createdAt: ModelTypes["DateTime"],
	id: ModelTypes["ID"],
	staffId: number,
	updatedAt: ModelTypes["DateTime"]
};
	["FilterInput"]: {
	/** Column (property) name to filter on */
	column: string,
	/** Exact value the column must equal */
	value: string
};
	["FindAllInput"]: {
	/** Set to true to return all records, ignoring pagination values */
	all?: boolean | undefined | null,
	/** Column/value pairs to filter by (records must satisfy **all** filters) */
	filters?: Array<ModelTypes["FilterInput"]> | undefined | null,
	/** Maximum number of records to return */
	limit?: number | undefined | null,
	/** Number of records to skip */
	offset?: number | undefined | null,
	/** Names of relations to eager-load (e.g. ["keyStage", "author"]) */
	relations?: Array<string> | undefined | null
};
	["FindOneByInput"]: {
	column: string,
	/** Relations to eager-load with this single record */
	relations?: Array<string> | undefined | null,
	value: string
};
	["IdInput"]: {
	id: number,
	/** Relations to eager-load with this single record */
	relations?: Array<string> | undefined | null
};
	["IdRequestDto"]: {
	id: number
};
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:any;
	["KeyStageEntity"]: {
		createdAt: ModelTypes["DateTime"],
	description?: string | undefined | null,
	id: ModelTypes["ID"],
	name?: string | undefined | null,
	stage: ModelTypes["ValidKeyStage"],
	updatedAt: ModelTypes["DateTime"],
	yearGroups: Array<ModelTypes["YearGroupEntity"]>
};
	["LessonEntity"]: {
		content?: ModelTypes["JSONObject"] | undefined | null,
	createdAt: ModelTypes["DateTime"],
	createdBy?: ModelTypes["EducatorProfileDto"] | undefined | null,
	createdById?: ModelTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	id: ModelTypes["ID"],
	multipleChoiceQuestions?: Array<ModelTypes["MultipleChoiceQuestionEntity"]> | undefined | null,
	quizzes?: Array<ModelTypes["QuizEntity"]> | undefined | null,
	recommendedYearGroups?: Array<ModelTypes["YearGroupEntity"]> | undefined | null,
	subject: ModelTypes["SubjectEntity"],
	title: string,
	topic: ModelTypes["TopicEntity"],
	updatedAt: ModelTypes["DateTime"]
};
	["LoginRequest"]: {
	email: string,
	password: string
};
	["LoginResponse"]: {
		accessToken: string,
	refreshToken: string,
	userDetails: ModelTypes["UserDetails"]
};
	["MultipleChoiceQuestionEntity"]: {
		correctAnswer: string,
	createdAt: ModelTypes["DateTime"],
	id: ModelTypes["ID"],
	lesson: ModelTypes["LessonEntity"],
	options: Array<string>,
	quiz?: ModelTypes["QuizEntity"] | undefined | null,
	text: string,
	updatedAt: ModelTypes["DateTime"]
};
	["Mutation"]: {
		/** Create one Assignment */
	createAssignment: ModelTypes["AssignmentEntity"],
	/** Create one AssignmentSubmission */
	createAssignmentSubmission: ModelTypes["AssignmentSubmissionEntity"],
	/** Create one Class */
	createClass: ModelTypes["ClassEntity"],
	/** Create one EducatorProfile */
	createEducatorProfile: ModelTypes["EducatorProfileDto"],
	/** Create one KeyStage */
	createKeyStage: ModelTypes["KeyStageEntity"],
	/** Create one Lesson */
	createLesson: ModelTypes["LessonEntity"],
	/** Create one MultipleChoiceQuestion */
	createMultipleChoiceQuestion: ModelTypes["MultipleChoiceQuestionEntity"],
	/** Create one Permission */
	createPermission: ModelTypes["Permission"],
	/** Create one PermissionGroup */
	createPermissionGroup: ModelTypes["PermissionGroup"],
	/** Create one Quiz */
	createQuiz: ModelTypes["QuizEntity"],
	/** Create one Role */
	createRole: ModelTypes["Role"],
	/** Create one StudentProfile */
	createStudentProfile: ModelTypes["StudentProfileDto"],
	/** Create one Subject */
	createSubject: ModelTypes["SubjectEntity"],
	/** Create one Topic */
	createTopic: ModelTypes["TopicEntity"],
	createUser: ModelTypes["User"],
	createUserWithProfile: ModelTypes["User"],
	/** Create one YearGroup */
	createYearGroup: ModelTypes["YearGroupEntity"],
	/** Delete one Assignment */
	deleteAssignment: boolean,
	/** Delete one AssignmentSubmission */
	deleteAssignmentSubmission: boolean,
	/** Delete one Class */
	deleteClass: boolean,
	/** Delete one EducatorProfile */
	deleteEducatorProfile: boolean,
	/** Delete one KeyStage */
	deleteKeyStage: boolean,
	/** Delete one Lesson */
	deleteLesson: boolean,
	/** Delete one MultipleChoiceQuestion */
	deleteMultipleChoiceQuestion: boolean,
	/** Delete one Permission */
	deletePermission: boolean,
	/** Delete one PermissionGroup */
	deletePermissionGroup: boolean,
	/** Delete one Quiz */
	deleteQuiz: boolean,
	/** Delete one Role */
	deleteRole: boolean,
	/** Delete one StudentProfile */
	deleteStudentProfile: boolean,
	/** Delete one Subject */
	deleteSubject: boolean,
	/** Delete one Topic */
	deleteTopic: boolean,
	/** Delete one YearGroup */
	deleteYearGroup: boolean,
	logUserInWithEmailAndPassword: ModelTypes["AuthTokens"],
	refreshUsersTokens: ModelTypes["LoginResponse"],
	registerNewUserLocally: ModelTypes["User"],
	removeUserByPublicId: ModelTypes["User"],
	/** Updates one Assignment */
	updateAssignment: ModelTypes["AssignmentEntity"],
	/** Updates one AssignmentSubmission */
	updateAssignmentSubmission: ModelTypes["AssignmentSubmissionEntity"],
	/** Updates one Class */
	updateClass: ModelTypes["ClassEntity"],
	/** Updates one EducatorProfile */
	updateEducatorProfile: ModelTypes["EducatorProfileDto"],
	/** Updates one KeyStage */
	updateKeyStage: ModelTypes["KeyStageEntity"],
	/** Updates one Lesson */
	updateLesson: ModelTypes["LessonEntity"],
	/** Updates one MultipleChoiceQuestion */
	updateMultipleChoiceQuestion: ModelTypes["MultipleChoiceQuestionEntity"],
	/** Updates one Permission */
	updatePermission: ModelTypes["Permission"],
	/** Updates one PermissionGroup */
	updatePermissionGroup: ModelTypes["PermissionGroup"],
	updatePermissionGroupPermissionsFromArray: ModelTypes["PermissionGroup"],
	updatePermissionGroupsForRole: ModelTypes["Role"],
	/** Updates one Quiz */
	updateQuiz: ModelTypes["QuizEntity"],
	/** Updates one Role */
	updateRole: ModelTypes["Role"],
	/** Updates one StudentProfile */
	updateStudentProfile: ModelTypes["StudentProfileDto"],
	/** Updates one Subject */
	updateSubject: ModelTypes["SubjectEntity"],
	/** Updates one Topic */
	updateTopic: ModelTypes["TopicEntity"],
	updateUserByPublicId: ModelTypes["User"],
	updateUserRolesFromArray: ModelTypes["User"],
	/** Updates one YearGroup */
	updateYearGroup: ModelTypes["YearGroupEntity"]
};
	["PageInfo"]: {
		hasNextPage: boolean,
	hasPreviousPage: boolean,
	itemCount: number,
	page: number,
	pageCount: number,
	take: number
};
	["PaginatedGetAllRequestDto"]: {
	limit?: number | undefined | null,
	offset?: number | undefined | null
};
	["PaginationInput"]: {
	page: number,
	take: number
};
	["Permission"]: {
		createdAt: ModelTypes["DateTime"],
	description?: string | undefined | null,
	id: ModelTypes["ID"],
	name: string,
	permissionGroups?: Array<ModelTypes["PermissionGroup"]> | undefined | null,
	roles?: Array<ModelTypes["Role"]> | undefined | null,
	updatedAt: ModelTypes["DateTime"]
};
	["PermissionDTO"]: {
		createdAt: ModelTypes["DateTime"],
	id: number,
	name: string,
	updatedAt: ModelTypes["DateTime"]
};
	["PermissionGroup"]: {
		createdAt: ModelTypes["DateTime"],
	description: string,
	id: ModelTypes["ID"],
	name: string,
	permissions?: Array<ModelTypes["Permission"]> | undefined | null,
	roles?: Array<ModelTypes["Role"]> | undefined | null,
	updatedAt: ModelTypes["DateTime"]
};
	["PublicIdRequestDto"]: {
	publicId: string
};
	["Query"]: {
		classesByYearAndSubject: Array<ModelTypes["ClassEntity"]>,
	/** Returns all Assignment (optionally filtered) */
	getAllAssignment: Array<ModelTypes["AssignmentEntity"]>,
	/** Returns all AssignmentSubmission (optionally filtered) */
	getAllAssignmentSubmission: Array<ModelTypes["AssignmentSubmissionEntity"]>,
	/** Returns all Class (optionally filtered) */
	getAllClass: Array<ModelTypes["ClassEntity"]>,
	/** Returns all EducatorProfile (optionally filtered) */
	getAllEducatorProfile: Array<ModelTypes["EducatorProfileDto"]>,
	/** Returns all KeyStage (optionally filtered) */
	getAllKeyStage: Array<ModelTypes["KeyStageEntity"]>,
	/** Returns all Lesson (optionally filtered) */
	getAllLesson: Array<ModelTypes["LessonEntity"]>,
	/** Returns all MultipleChoiceQuestion (optionally filtered) */
	getAllMultipleChoiceQuestion: Array<ModelTypes["MultipleChoiceQuestionEntity"]>,
	/** Returns all Permission (optionally filtered) */
	getAllPermission: Array<ModelTypes["Permission"]>,
	/** Returns all PermissionGroup (optionally filtered) */
	getAllPermissionGroup: Array<ModelTypes["PermissionGroup"]>,
	/** Returns all Quiz (optionally filtered) */
	getAllQuiz: Array<ModelTypes["QuizEntity"]>,
	/** Returns all Role (optionally filtered) */
	getAllRole: Array<ModelTypes["Role"]>,
	/** Returns all StudentProfile (optionally filtered) */
	getAllStudentProfile: Array<ModelTypes["StudentProfileDto"]>,
	/** Returns all Subject (optionally filtered) */
	getAllSubject: Array<ModelTypes["SubjectEntity"]>,
	/** Returns all Topic (optionally filtered) */
	getAllTopic: Array<ModelTypes["TopicEntity"]>,
	getAllUsers: Array<ModelTypes["User"]>,
	/** Returns all YearGroup (optionally filtered) */
	getAllYearGroup: Array<ModelTypes["YearGroupEntity"]>,
	/** Returns one Assignment */
	getAssignment: ModelTypes["AssignmentEntity"],
	/** Returns one Assignment by given conditions */
	getAssignmentBy: ModelTypes["AssignmentEntity"],
	/** Returns one AssignmentSubmission */
	getAssignmentSubmission: ModelTypes["AssignmentSubmissionEntity"],
	/** Returns one AssignmentSubmission by given conditions */
	getAssignmentSubmissionBy: ModelTypes["AssignmentSubmissionEntity"],
	/** Returns one Class */
	getClass: ModelTypes["ClassEntity"],
	/** Returns one Class by given conditions */
	getClassBy: ModelTypes["ClassEntity"],
	/** Returns one EducatorProfile */
	getEducatorProfile: ModelTypes["EducatorProfileDto"],
	/** Returns one EducatorProfile by given conditions */
	getEducatorProfileBy: ModelTypes["EducatorProfileDto"],
	/** Returns one KeyStage */
	getKeyStage: ModelTypes["KeyStageEntity"],
	/** Returns one KeyStage by given conditions */
	getKeyStageBy: ModelTypes["KeyStageEntity"],
	/** Returns one Lesson */
	getLesson: ModelTypes["LessonEntity"],
	/** Returns one Lesson by given conditions */
	getLessonBy: ModelTypes["LessonEntity"],
	/** Returns one MultipleChoiceQuestion */
	getMultipleChoiceQuestion: ModelTypes["MultipleChoiceQuestionEntity"],
	/** Returns one MultipleChoiceQuestion by given conditions */
	getMultipleChoiceQuestionBy: ModelTypes["MultipleChoiceQuestionEntity"],
	/** Returns one Permission */
	getPermission: ModelTypes["Permission"],
	/** Returns one Permission by given conditions */
	getPermissionBy: ModelTypes["Permission"],
	/** Returns one PermissionGroup */
	getPermissionGroup: ModelTypes["PermissionGroup"],
	/** Returns one PermissionGroup by given conditions */
	getPermissionGroupBy: ModelTypes["PermissionGroup"],
	getPermissionGroupsForRole: Array<ModelTypes["PermissionGroup"]>,
	getPermissionsForGroup: Array<ModelTypes["Permission"]>,
	/** Returns one Quiz */
	getQuiz: ModelTypes["QuizEntity"],
	/** Returns one Quiz by given conditions */
	getQuizBy: ModelTypes["QuizEntity"],
	/** Returns one Role */
	getRole: ModelTypes["Role"],
	/** Returns one Role by given conditions */
	getRoleBy: ModelTypes["Role"],
	getRolesForUser: Array<ModelTypes["Role"]>,
	/** Returns one StudentProfile */
	getStudentProfile: ModelTypes["StudentProfileDto"],
	/** Returns one StudentProfile by given conditions */
	getStudentProfileBy: ModelTypes["StudentProfileDto"],
	/** Returns one Subject */
	getSubject: ModelTypes["SubjectEntity"],
	/** Returns one Subject by given conditions */
	getSubjectBy: ModelTypes["SubjectEntity"],
	/** Returns one Topic */
	getTopic: ModelTypes["TopicEntity"],
	/** Returns one Topic by given conditions */
	getTopicBy: ModelTypes["TopicEntity"],
	getUserByPublicId: ModelTypes["User"],
	getUsersRolesAndPermissions: ModelTypes["RolesPermissionsResponse"],
	/** Returns one YearGroup */
	getYearGroup: ModelTypes["YearGroupEntity"],
	/** Returns one YearGroup by given conditions */
	getYearGroupBy: ModelTypes["YearGroupEntity"],
	/** Search Assignment records by given columns */
	searchAssignment: Array<ModelTypes["AssignmentEntity"]>,
	/** Search AssignmentSubmission records by given columns */
	searchAssignmentSubmission: Array<ModelTypes["AssignmentSubmissionEntity"]>,
	/** Search Class records by given columns */
	searchClass: Array<ModelTypes["ClassEntity"]>,
	/** Search EducatorProfile records by given columns */
	searchEducatorProfile: Array<ModelTypes["EducatorProfileDto"]>,
	/** Search KeyStage records by given columns */
	searchKeyStage: Array<ModelTypes["KeyStageEntity"]>,
	/** Search Lesson records by given columns */
	searchLesson: Array<ModelTypes["LessonEntity"]>,
	/** Search MultipleChoiceQuestion records by given columns */
	searchMultipleChoiceQuestion: Array<ModelTypes["MultipleChoiceQuestionEntity"]>,
	/** Search Permission records by given columns */
	searchPermission: Array<ModelTypes["Permission"]>,
	/** Search PermissionGroup records by given columns */
	searchPermissionGroup: Array<ModelTypes["PermissionGroup"]>,
	/** Search Quiz records by given columns */
	searchQuiz: Array<ModelTypes["QuizEntity"]>,
	/** Search Role records by given columns */
	searchRole: Array<ModelTypes["Role"]>,
	/** Search StudentProfile records by given columns */
	searchStudentProfile: Array<ModelTypes["StudentProfileDto"]>,
	/** Search Subject records by given columns */
	searchSubject: Array<ModelTypes["SubjectEntity"]>,
	/** Search Topic records by given columns */
	searchTopic: Array<ModelTypes["TopicEntity"]>,
	searchUsers: Array<ModelTypes["User"]>,
	/** Search YearGroup records by given columns */
	searchYearGroup: Array<ModelTypes["YearGroupEntity"]>,
	topicsByYearAndSubject: Array<ModelTypes["TopicEntity"]>
};
	["QuizEntity"]: {
		createdAt: ModelTypes["DateTime"],
	description?: string | undefined | null,
	id: ModelTypes["ID"],
	lesson: ModelTypes["LessonEntity"],
	multipleChoiceQuestions?: Array<ModelTypes["MultipleChoiceQuestionEntity"]> | undefined | null,
	title: string,
	updatedAt: ModelTypes["DateTime"]
};
	["RelationIdsInput"]: {
	ids: Array<ModelTypes["ID"]>,
	relation: string
};
	["Role"]: {
		createdAt: ModelTypes["DateTime"],
	description: string,
	id: ModelTypes["ID"],
	name: string,
	permissionGroups?: Array<ModelTypes["PermissionGroup"]> | undefined | null,
	permissions?: Array<ModelTypes["Permission"]> | undefined | null,
	updatedAt: ModelTypes["DateTime"]
};
	["RoleDTO"]: {
		createdAt: ModelTypes["DateTime"],
	id: number,
	name: string,
	updatedAt: ModelTypes["DateTime"]
};
	["RolesPermissionsResponse"]: {
		permissions: Array<ModelTypes["PermissionDTO"]>,
	roles: Array<ModelTypes["RoleDTO"]>
};
	["SearchInput"]: {
	columns: Array<string>,
	filters?: Array<ModelTypes["FilterInput"]> | undefined | null,
	limit?: number | undefined | null,
	relations?: Array<string> | undefined | null,
	search: string
};
	["StudentProfileDto"]: {
		createdAt: ModelTypes["DateTime"],
	id: ModelTypes["ID"],
	schoolYear: number,
	studentId: number,
	updatedAt: ModelTypes["DateTime"]
};
	["SubjectEntity"]: {
		createdAt: ModelTypes["DateTime"],
	id: ModelTypes["ID"],
	lessons?: Array<ModelTypes["LessonEntity"]> | undefined | null,
	name: string,
	topics?: Array<ModelTypes["TopicEntity"]> | undefined | null,
	updatedAt: ModelTypes["DateTime"],
	yearGroups?: Array<ModelTypes["YearGroupEntity"]> | undefined | null
};
	["SubmitIdArrayByIdRequestDto"]: {
	idArray: Array<number>,
	recordId: number
};
	["TopicByYearSubjectInput"]: {
	pagination?: ModelTypes["PaginationInput"] | undefined | null,
	subjectId: ModelTypes["ID"],
	withLessons: boolean,
	yearGroupId: ModelTypes["ID"]
};
	["TopicEntity"]: {
		createdAt: ModelTypes["DateTime"],
	id: ModelTypes["ID"],
	lessons?: Array<ModelTypes["LessonEntity"]> | undefined | null,
	name: string,
	subject: ModelTypes["SubjectEntity"],
	updatedAt: ModelTypes["DateTime"],
	yearGroup: ModelTypes["YearGroupEntity"]
};
	["UpdateAssignmentInput"]: {
	classId?: ModelTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	dueDate?: ModelTypes["DateTime"] | undefined | null,
	id: ModelTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateAssignmentSubmissionInput"]: {
	assignmentId?: ModelTypes["ID"] | undefined | null,
	feedback?: string | undefined | null,
	grade?: string | undefined | null,
	id: ModelTypes["ID"],
	studentId?: ModelTypes["ID"] | undefined | null,
	submissionContent?: string | undefined | null,
	submittedAt?: ModelTypes["DateTime"] | undefined | null
};
	["UpdateClassInput"]: {
	id: ModelTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateEducatorProfileInput"]: {
	id: number,
	staffId?: number | undefined | null
};
	["UpdateKeyStageInput"]: {
	description?: string | undefined | null,
	id: ModelTypes["ID"],
	name?: string | undefined | null
};
	["UpdateLessonInput"]: {
	content?: ModelTypes["JSONObject"] | undefined | null,
	createdByEducatorId?: ModelTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	id: ModelTypes["ID"],
	recommendedYearGroupIds?: Array<ModelTypes["ID"]> | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null,
	title?: string | undefined | null
};
	["UpdateMultipleChoiceQuestionInput"]: {
	correctAnswer?: string | undefined | null,
	id: ModelTypes["ID"],
	lessonId?: ModelTypes["ID"] | undefined | null,
	options?: Array<string> | undefined | null,
	quizId?: ModelTypes["ID"] | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null,
	text?: string | undefined | null
};
	["UpdatePermissionGroupInput"]: {
	description?: string | undefined | null,
	id: number,
	name?: string | undefined | null
};
	["UpdatePermissionInput"]: {
	description?: string | undefined | null,
	id: number,
	name?: string | undefined | null
};
	["UpdateQuizInput"]: {
	description?: string | undefined | null,
	id: ModelTypes["ID"],
	lessonId?: ModelTypes["ID"] | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null,
	title?: string | undefined | null
};
	["UpdateRoleInput"]: {
	description?: string | undefined | null,
	id: number,
	name?: string | undefined | null
};
	["UpdateStudentProfileInput"]: {
	id: number,
	schoolYear?: number | undefined | null,
	studentId?: number | undefined | null
};
	["UpdateSubjectInput"]: {
	id: ModelTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateTopicInput"]: {
	id: ModelTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<ModelTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateUserRolesFromArrayRequestDto"]: {
	publicId: string,
	roleIds: Array<number>
};
	["UpdateUserWithProfileInput"]: {
	addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	dateOfBirth?: ModelTypes["DateTime"] | undefined | null,
	educatorProfile?: ModelTypes["CreateEducatorProfileInput"] | undefined | null,
	email: string,
	firstName: string,
	lastName: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	publicId: string,
	studentProfile?: ModelTypes["CreateStudentProfileInput"] | undefined | null,
	userType: string
};
	["UpdateYearGroupInput"]: {
	id: ModelTypes["ID"],
	keyStageId?: ModelTypes["ID"] | undefined | null,
	year?: ModelTypes["ValidYear"] | undefined | null
};
	["User"]: {
		addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	createdAt: ModelTypes["DateTime"],
	dateOfBirth?: ModelTypes["DateTime"] | undefined | null,
	educatorProfile?: ModelTypes["EducatorProfileDto"] | undefined | null,
	email: string,
	firstName: string,
	id: ModelTypes["ID"],
	lastName: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	publicId: string,
	roles?: Array<ModelTypes["Role"]> | undefined | null,
	studentProfile?: ModelTypes["StudentProfileDto"] | undefined | null,
	updatedAt: ModelTypes["DateTime"],
	userType: string
};
	["UserDetails"]: {
		permissions: Array<string>,
	publicId: string
};
	["UserPermissionsInput"]: {
	publicId: string
};
	["ValidKeyStage"]:ValidKeyStage;
	["ValidYear"]:ValidYear;
	["YearGroupEntity"]: {
		createdAt: ModelTypes["DateTime"],
	id: ModelTypes["ID"],
	keyStage?: ModelTypes["KeyStageEntity"] | undefined | null,
	subjects?: Array<ModelTypes["SubjectEntity"]> | undefined | null,
	topics?: Array<ModelTypes["TopicEntity"]> | undefined | null,
	updatedAt: ModelTypes["DateTime"],
	year: ModelTypes["ValidYear"]
};
	["schema"]: {
	query?: ModelTypes["Query"] | undefined | null,
	mutation?: ModelTypes["Mutation"] | undefined | null
};
	["ID"]:any
    }

export type GraphQLTypes = {
    ["AssignmentEntity"]: {
	__typename: "AssignmentEntity",
	class: GraphQLTypes["ClassEntity"],
	createdAt: GraphQLTypes["DateTime"],
	description?: string | undefined | null,
	dueDate?: GraphQLTypes["DateTime"] | undefined | null,
	educators?: Array<GraphQLTypes["EducatorProfileDto"]> | undefined | null,
	id: GraphQLTypes["ID"],
	lessons?: Array<GraphQLTypes["LessonEntity"]> | undefined | null,
	name: string,
	students?: Array<GraphQLTypes["StudentProfileDto"]> | undefined | null,
	updatedAt: GraphQLTypes["DateTime"]
};
	["AssignmentSubmissionEntity"]: {
	__typename: "AssignmentSubmissionEntity",
	assignment: GraphQLTypes["AssignmentEntity"],
	createdAt: GraphQLTypes["DateTime"],
	feedback?: string | undefined | null,
	grade?: string | undefined | null,
	id: GraphQLTypes["ID"],
	student: GraphQLTypes["StudentProfileDto"],
	submissionContent?: string | undefined | null,
	submittedAt?: GraphQLTypes["DateTime"] | undefined | null,
	updatedAt: GraphQLTypes["DateTime"]
};
	["AuthTokens"]: {
	__typename: "AuthTokens",
	accessToken: string,
	refreshToken: string
};
	["ClassByYearSubjectInput"]: {
		pagination?: GraphQLTypes["PaginationInput"] | undefined | null,
	subjectId: GraphQLTypes["ID"],
	withEducators: boolean,
	withStudents: boolean,
	yearGroupId: GraphQLTypes["ID"]
};
	["ClassEntity"]: {
	__typename: "ClassEntity",
	createdAt: GraphQLTypes["DateTime"],
	educators?: Array<GraphQLTypes["EducatorProfileDto"]> | undefined | null,
	id: GraphQLTypes["ID"],
	name: string,
	students?: Array<GraphQLTypes["StudentProfileDto"]> | undefined | null,
	subject: GraphQLTypes["SubjectEntity"],
	updatedAt: GraphQLTypes["DateTime"],
	yearGroup: GraphQLTypes["YearGroupEntity"]
};
	["CreateAssignmentInput"]: {
		classId: GraphQLTypes["ID"],
	description?: string | undefined | null,
	dueDate?: GraphQLTypes["DateTime"] | undefined | null,
	name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null
};
	["CreateAssignmentSubmissionInput"]: {
		assignmentId: GraphQLTypes["ID"],
	feedback?: string | undefined | null,
	grade?: string | undefined | null,
	studentId: GraphQLTypes["ID"],
	submissionContent?: string | undefined | null,
	submittedAt?: GraphQLTypes["DateTime"] | undefined | null
};
	["CreateClassInput"]: {
		name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null
};
	["CreateEducatorProfileInput"]: {
		staffId: number
};
	["CreateKeyStageInput"]: {
		description?: string | undefined | null,
	name: string
};
	["CreateLessonInput"]: {
		content?: GraphQLTypes["JSONObject"] | undefined | null,
	createdByEducatorId?: GraphQLTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	recommendedYearGroupIds?: Array<GraphQLTypes["ID"] | undefined | null> | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null,
	title: string
};
	["CreateMultipleChoiceQuestionInput"]: {
		correctAnswer: string,
	lessonId: GraphQLTypes["ID"],
	options: Array<string>,
	quizId?: GraphQLTypes["ID"] | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null,
	text: string
};
	["CreatePermissionGroupInput"]: {
		description: string,
	name: string
};
	["CreatePermissionInput"]: {
		description?: string | undefined | null,
	name: string
};
	["CreateQuizInput"]: {
		description?: string | undefined | null,
	lessonId: GraphQLTypes["ID"],
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null,
	title: string
};
	["CreateRoleInput"]: {
		description?: string | undefined | null,
	name: string
};
	["CreateStudentProfileInput"]: {
		schoolYear: number,
	studentId: number
};
	["CreateSubjectInput"]: {
		name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null
};
	["CreateTopicInput"]: {
		name: string,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null
};
	["CreateUserRequestDto"]: {
		addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	dateOfBirth?: GraphQLTypes["DateTime"] | undefined | null,
	email: string,
	firstName: string,
	lastName: string,
	password: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	userType: string
};
	["CreateUserWithProfileInput"]: {
		addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	dateOfBirth?: GraphQLTypes["DateTime"] | undefined | null,
	educatorProfile?: GraphQLTypes["CreateEducatorProfileInput"] | undefined | null,
	email: string,
	firstName: string,
	lastName: string,
	password: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	studentProfile?: GraphQLTypes["CreateStudentProfileInput"] | undefined | null,
	userType: string
};
	["CreateYearGroupInput"]: {
		keyStageId?: GraphQLTypes["ID"] | undefined | null,
	year: GraphQLTypes["ValidYear"]
};
	/** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
["DateTime"]: "scalar" & { name: "DateTime" };
	["EducatorProfileDto"]: {
	__typename: "EducatorProfileDto",
	createdAt: GraphQLTypes["DateTime"],
	id: GraphQLTypes["ID"],
	staffId: number,
	updatedAt: GraphQLTypes["DateTime"]
};
	["FilterInput"]: {
		/** Column (property) name to filter on */
	column: string,
	/** Exact value the column must equal */
	value: string
};
	["FindAllInput"]: {
		/** Set to true to return all records, ignoring pagination values */
	all?: boolean | undefined | null,
	/** Column/value pairs to filter by (records must satisfy **all** filters) */
	filters?: Array<GraphQLTypes["FilterInput"]> | undefined | null,
	/** Maximum number of records to return */
	limit?: number | undefined | null,
	/** Number of records to skip */
	offset?: number | undefined | null,
	/** Names of relations to eager-load (e.g. ["keyStage", "author"]) */
	relations?: Array<string> | undefined | null
};
	["FindOneByInput"]: {
		column: string,
	/** Relations to eager-load with this single record */
	relations?: Array<string> | undefined | null,
	value: string
};
	["IdInput"]: {
		id: number,
	/** Relations to eager-load with this single record */
	relations?: Array<string> | undefined | null
};
	["IdRequestDto"]: {
		id: number
};
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]: "scalar" & { name: "JSONObject" };
	["KeyStageEntity"]: {
	__typename: "KeyStageEntity",
	createdAt: GraphQLTypes["DateTime"],
	description?: string | undefined | null,
	id: GraphQLTypes["ID"],
	name?: string | undefined | null,
	stage: GraphQLTypes["ValidKeyStage"],
	updatedAt: GraphQLTypes["DateTime"],
	yearGroups: Array<GraphQLTypes["YearGroupEntity"]>
};
	["LessonEntity"]: {
	__typename: "LessonEntity",
	content?: GraphQLTypes["JSONObject"] | undefined | null,
	createdAt: GraphQLTypes["DateTime"],
	createdBy?: GraphQLTypes["EducatorProfileDto"] | undefined | null,
	createdById?: GraphQLTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	id: GraphQLTypes["ID"],
	multipleChoiceQuestions?: Array<GraphQLTypes["MultipleChoiceQuestionEntity"]> | undefined | null,
	quizzes?: Array<GraphQLTypes["QuizEntity"]> | undefined | null,
	recommendedYearGroups?: Array<GraphQLTypes["YearGroupEntity"]> | undefined | null,
	subject: GraphQLTypes["SubjectEntity"],
	title: string,
	topic: GraphQLTypes["TopicEntity"],
	updatedAt: GraphQLTypes["DateTime"]
};
	["LoginRequest"]: {
		email: string,
	password: string
};
	["LoginResponse"]: {
	__typename: "LoginResponse",
	accessToken: string,
	refreshToken: string,
	userDetails: GraphQLTypes["UserDetails"]
};
	["MultipleChoiceQuestionEntity"]: {
	__typename: "MultipleChoiceQuestionEntity",
	correctAnswer: string,
	createdAt: GraphQLTypes["DateTime"],
	id: GraphQLTypes["ID"],
	lesson: GraphQLTypes["LessonEntity"],
	options: Array<string>,
	quiz?: GraphQLTypes["QuizEntity"] | undefined | null,
	text: string,
	updatedAt: GraphQLTypes["DateTime"]
};
	["Mutation"]: {
	__typename: "Mutation",
	/** Create one Assignment */
	createAssignment: GraphQLTypes["AssignmentEntity"],
	/** Create one AssignmentSubmission */
	createAssignmentSubmission: GraphQLTypes["AssignmentSubmissionEntity"],
	/** Create one Class */
	createClass: GraphQLTypes["ClassEntity"],
	/** Create one EducatorProfile */
	createEducatorProfile: GraphQLTypes["EducatorProfileDto"],
	/** Create one KeyStage */
	createKeyStage: GraphQLTypes["KeyStageEntity"],
	/** Create one Lesson */
	createLesson: GraphQLTypes["LessonEntity"],
	/** Create one MultipleChoiceQuestion */
	createMultipleChoiceQuestion: GraphQLTypes["MultipleChoiceQuestionEntity"],
	/** Create one Permission */
	createPermission: GraphQLTypes["Permission"],
	/** Create one PermissionGroup */
	createPermissionGroup: GraphQLTypes["PermissionGroup"],
	/** Create one Quiz */
	createQuiz: GraphQLTypes["QuizEntity"],
	/** Create one Role */
	createRole: GraphQLTypes["Role"],
	/** Create one StudentProfile */
	createStudentProfile: GraphQLTypes["StudentProfileDto"],
	/** Create one Subject */
	createSubject: GraphQLTypes["SubjectEntity"],
	/** Create one Topic */
	createTopic: GraphQLTypes["TopicEntity"],
	createUser: GraphQLTypes["User"],
	createUserWithProfile: GraphQLTypes["User"],
	/** Create one YearGroup */
	createYearGroup: GraphQLTypes["YearGroupEntity"],
	/** Delete one Assignment */
	deleteAssignment: boolean,
	/** Delete one AssignmentSubmission */
	deleteAssignmentSubmission: boolean,
	/** Delete one Class */
	deleteClass: boolean,
	/** Delete one EducatorProfile */
	deleteEducatorProfile: boolean,
	/** Delete one KeyStage */
	deleteKeyStage: boolean,
	/** Delete one Lesson */
	deleteLesson: boolean,
	/** Delete one MultipleChoiceQuestion */
	deleteMultipleChoiceQuestion: boolean,
	/** Delete one Permission */
	deletePermission: boolean,
	/** Delete one PermissionGroup */
	deletePermissionGroup: boolean,
	/** Delete one Quiz */
	deleteQuiz: boolean,
	/** Delete one Role */
	deleteRole: boolean,
	/** Delete one StudentProfile */
	deleteStudentProfile: boolean,
	/** Delete one Subject */
	deleteSubject: boolean,
	/** Delete one Topic */
	deleteTopic: boolean,
	/** Delete one YearGroup */
	deleteYearGroup: boolean,
	logUserInWithEmailAndPassword: GraphQLTypes["AuthTokens"],
	refreshUsersTokens: GraphQLTypes["LoginResponse"],
	registerNewUserLocally: GraphQLTypes["User"],
	removeUserByPublicId: GraphQLTypes["User"],
	/** Updates one Assignment */
	updateAssignment: GraphQLTypes["AssignmentEntity"],
	/** Updates one AssignmentSubmission */
	updateAssignmentSubmission: GraphQLTypes["AssignmentSubmissionEntity"],
	/** Updates one Class */
	updateClass: GraphQLTypes["ClassEntity"],
	/** Updates one EducatorProfile */
	updateEducatorProfile: GraphQLTypes["EducatorProfileDto"],
	/** Updates one KeyStage */
	updateKeyStage: GraphQLTypes["KeyStageEntity"],
	/** Updates one Lesson */
	updateLesson: GraphQLTypes["LessonEntity"],
	/** Updates one MultipleChoiceQuestion */
	updateMultipleChoiceQuestion: GraphQLTypes["MultipleChoiceQuestionEntity"],
	/** Updates one Permission */
	updatePermission: GraphQLTypes["Permission"],
	/** Updates one PermissionGroup */
	updatePermissionGroup: GraphQLTypes["PermissionGroup"],
	updatePermissionGroupPermissionsFromArray: GraphQLTypes["PermissionGroup"],
	updatePermissionGroupsForRole: GraphQLTypes["Role"],
	/** Updates one Quiz */
	updateQuiz: GraphQLTypes["QuizEntity"],
	/** Updates one Role */
	updateRole: GraphQLTypes["Role"],
	/** Updates one StudentProfile */
	updateStudentProfile: GraphQLTypes["StudentProfileDto"],
	/** Updates one Subject */
	updateSubject: GraphQLTypes["SubjectEntity"],
	/** Updates one Topic */
	updateTopic: GraphQLTypes["TopicEntity"],
	updateUserByPublicId: GraphQLTypes["User"],
	updateUserRolesFromArray: GraphQLTypes["User"],
	/** Updates one YearGroup */
	updateYearGroup: GraphQLTypes["YearGroupEntity"]
};
	["PageInfo"]: {
	__typename: "PageInfo",
	hasNextPage: boolean,
	hasPreviousPage: boolean,
	itemCount: number,
	page: number,
	pageCount: number,
	take: number
};
	["PaginatedGetAllRequestDto"]: {
		limit?: number | undefined | null,
	offset?: number | undefined | null
};
	["PaginationInput"]: {
		page: number,
	take: number
};
	["Permission"]: {
	__typename: "Permission",
	createdAt: GraphQLTypes["DateTime"],
	description?: string | undefined | null,
	id: GraphQLTypes["ID"],
	name: string,
	permissionGroups?: Array<GraphQLTypes["PermissionGroup"]> | undefined | null,
	roles?: Array<GraphQLTypes["Role"]> | undefined | null,
	updatedAt: GraphQLTypes["DateTime"]
};
	["PermissionDTO"]: {
	__typename: "PermissionDTO",
	createdAt: GraphQLTypes["DateTime"],
	id: number,
	name: string,
	updatedAt: GraphQLTypes["DateTime"]
};
	["PermissionGroup"]: {
	__typename: "PermissionGroup",
	createdAt: GraphQLTypes["DateTime"],
	description: string,
	id: GraphQLTypes["ID"],
	name: string,
	permissions?: Array<GraphQLTypes["Permission"]> | undefined | null,
	roles?: Array<GraphQLTypes["Role"]> | undefined | null,
	updatedAt: GraphQLTypes["DateTime"]
};
	["PublicIdRequestDto"]: {
		publicId: string
};
	["Query"]: {
	__typename: "Query",
	classesByYearAndSubject: Array<GraphQLTypes["ClassEntity"]>,
	/** Returns all Assignment (optionally filtered) */
	getAllAssignment: Array<GraphQLTypes["AssignmentEntity"]>,
	/** Returns all AssignmentSubmission (optionally filtered) */
	getAllAssignmentSubmission: Array<GraphQLTypes["AssignmentSubmissionEntity"]>,
	/** Returns all Class (optionally filtered) */
	getAllClass: Array<GraphQLTypes["ClassEntity"]>,
	/** Returns all EducatorProfile (optionally filtered) */
	getAllEducatorProfile: Array<GraphQLTypes["EducatorProfileDto"]>,
	/** Returns all KeyStage (optionally filtered) */
	getAllKeyStage: Array<GraphQLTypes["KeyStageEntity"]>,
	/** Returns all Lesson (optionally filtered) */
	getAllLesson: Array<GraphQLTypes["LessonEntity"]>,
	/** Returns all MultipleChoiceQuestion (optionally filtered) */
	getAllMultipleChoiceQuestion: Array<GraphQLTypes["MultipleChoiceQuestionEntity"]>,
	/** Returns all Permission (optionally filtered) */
	getAllPermission: Array<GraphQLTypes["Permission"]>,
	/** Returns all PermissionGroup (optionally filtered) */
	getAllPermissionGroup: Array<GraphQLTypes["PermissionGroup"]>,
	/** Returns all Quiz (optionally filtered) */
	getAllQuiz: Array<GraphQLTypes["QuizEntity"]>,
	/** Returns all Role (optionally filtered) */
	getAllRole: Array<GraphQLTypes["Role"]>,
	/** Returns all StudentProfile (optionally filtered) */
	getAllStudentProfile: Array<GraphQLTypes["StudentProfileDto"]>,
	/** Returns all Subject (optionally filtered) */
	getAllSubject: Array<GraphQLTypes["SubjectEntity"]>,
	/** Returns all Topic (optionally filtered) */
	getAllTopic: Array<GraphQLTypes["TopicEntity"]>,
	getAllUsers: Array<GraphQLTypes["User"]>,
	/** Returns all YearGroup (optionally filtered) */
	getAllYearGroup: Array<GraphQLTypes["YearGroupEntity"]>,
	/** Returns one Assignment */
	getAssignment: GraphQLTypes["AssignmentEntity"],
	/** Returns one Assignment by given conditions */
	getAssignmentBy: GraphQLTypes["AssignmentEntity"],
	/** Returns one AssignmentSubmission */
	getAssignmentSubmission: GraphQLTypes["AssignmentSubmissionEntity"],
	/** Returns one AssignmentSubmission by given conditions */
	getAssignmentSubmissionBy: GraphQLTypes["AssignmentSubmissionEntity"],
	/** Returns one Class */
	getClass: GraphQLTypes["ClassEntity"],
	/** Returns one Class by given conditions */
	getClassBy: GraphQLTypes["ClassEntity"],
	/** Returns one EducatorProfile */
	getEducatorProfile: GraphQLTypes["EducatorProfileDto"],
	/** Returns one EducatorProfile by given conditions */
	getEducatorProfileBy: GraphQLTypes["EducatorProfileDto"],
	/** Returns one KeyStage */
	getKeyStage: GraphQLTypes["KeyStageEntity"],
	/** Returns one KeyStage by given conditions */
	getKeyStageBy: GraphQLTypes["KeyStageEntity"],
	/** Returns one Lesson */
	getLesson: GraphQLTypes["LessonEntity"],
	/** Returns one Lesson by given conditions */
	getLessonBy: GraphQLTypes["LessonEntity"],
	/** Returns one MultipleChoiceQuestion */
	getMultipleChoiceQuestion: GraphQLTypes["MultipleChoiceQuestionEntity"],
	/** Returns one MultipleChoiceQuestion by given conditions */
	getMultipleChoiceQuestionBy: GraphQLTypes["MultipleChoiceQuestionEntity"],
	/** Returns one Permission */
	getPermission: GraphQLTypes["Permission"],
	/** Returns one Permission by given conditions */
	getPermissionBy: GraphQLTypes["Permission"],
	/** Returns one PermissionGroup */
	getPermissionGroup: GraphQLTypes["PermissionGroup"],
	/** Returns one PermissionGroup by given conditions */
	getPermissionGroupBy: GraphQLTypes["PermissionGroup"],
	getPermissionGroupsForRole: Array<GraphQLTypes["PermissionGroup"]>,
	getPermissionsForGroup: Array<GraphQLTypes["Permission"]>,
	/** Returns one Quiz */
	getQuiz: GraphQLTypes["QuizEntity"],
	/** Returns one Quiz by given conditions */
	getQuizBy: GraphQLTypes["QuizEntity"],
	/** Returns one Role */
	getRole: GraphQLTypes["Role"],
	/** Returns one Role by given conditions */
	getRoleBy: GraphQLTypes["Role"],
	getRolesForUser: Array<GraphQLTypes["Role"]>,
	/** Returns one StudentProfile */
	getStudentProfile: GraphQLTypes["StudentProfileDto"],
	/** Returns one StudentProfile by given conditions */
	getStudentProfileBy: GraphQLTypes["StudentProfileDto"],
	/** Returns one Subject */
	getSubject: GraphQLTypes["SubjectEntity"],
	/** Returns one Subject by given conditions */
	getSubjectBy: GraphQLTypes["SubjectEntity"],
	/** Returns one Topic */
	getTopic: GraphQLTypes["TopicEntity"],
	/** Returns one Topic by given conditions */
	getTopicBy: GraphQLTypes["TopicEntity"],
	getUserByPublicId: GraphQLTypes["User"],
	getUsersRolesAndPermissions: GraphQLTypes["RolesPermissionsResponse"],
	/** Returns one YearGroup */
	getYearGroup: GraphQLTypes["YearGroupEntity"],
	/** Returns one YearGroup by given conditions */
	getYearGroupBy: GraphQLTypes["YearGroupEntity"],
	/** Search Assignment records by given columns */
	searchAssignment: Array<GraphQLTypes["AssignmentEntity"]>,
	/** Search AssignmentSubmission records by given columns */
	searchAssignmentSubmission: Array<GraphQLTypes["AssignmentSubmissionEntity"]>,
	/** Search Class records by given columns */
	searchClass: Array<GraphQLTypes["ClassEntity"]>,
	/** Search EducatorProfile records by given columns */
	searchEducatorProfile: Array<GraphQLTypes["EducatorProfileDto"]>,
	/** Search KeyStage records by given columns */
	searchKeyStage: Array<GraphQLTypes["KeyStageEntity"]>,
	/** Search Lesson records by given columns */
	searchLesson: Array<GraphQLTypes["LessonEntity"]>,
	/** Search MultipleChoiceQuestion records by given columns */
	searchMultipleChoiceQuestion: Array<GraphQLTypes["MultipleChoiceQuestionEntity"]>,
	/** Search Permission records by given columns */
	searchPermission: Array<GraphQLTypes["Permission"]>,
	/** Search PermissionGroup records by given columns */
	searchPermissionGroup: Array<GraphQLTypes["PermissionGroup"]>,
	/** Search Quiz records by given columns */
	searchQuiz: Array<GraphQLTypes["QuizEntity"]>,
	/** Search Role records by given columns */
	searchRole: Array<GraphQLTypes["Role"]>,
	/** Search StudentProfile records by given columns */
	searchStudentProfile: Array<GraphQLTypes["StudentProfileDto"]>,
	/** Search Subject records by given columns */
	searchSubject: Array<GraphQLTypes["SubjectEntity"]>,
	/** Search Topic records by given columns */
	searchTopic: Array<GraphQLTypes["TopicEntity"]>,
	searchUsers: Array<GraphQLTypes["User"]>,
	/** Search YearGroup records by given columns */
	searchYearGroup: Array<GraphQLTypes["YearGroupEntity"]>,
	topicsByYearAndSubject: Array<GraphQLTypes["TopicEntity"]>
};
	["QuizEntity"]: {
	__typename: "QuizEntity",
	createdAt: GraphQLTypes["DateTime"],
	description?: string | undefined | null,
	id: GraphQLTypes["ID"],
	lesson: GraphQLTypes["LessonEntity"],
	multipleChoiceQuestions?: Array<GraphQLTypes["MultipleChoiceQuestionEntity"]> | undefined | null,
	title: string,
	updatedAt: GraphQLTypes["DateTime"]
};
	["RelationIdsInput"]: {
		ids: Array<GraphQLTypes["ID"]>,
	relation: string
};
	["Role"]: {
	__typename: "Role",
	createdAt: GraphQLTypes["DateTime"],
	description: string,
	id: GraphQLTypes["ID"],
	name: string,
	permissionGroups?: Array<GraphQLTypes["PermissionGroup"]> | undefined | null,
	permissions?: Array<GraphQLTypes["Permission"]> | undefined | null,
	updatedAt: GraphQLTypes["DateTime"]
};
	["RoleDTO"]: {
	__typename: "RoleDTO",
	createdAt: GraphQLTypes["DateTime"],
	id: number,
	name: string,
	updatedAt: GraphQLTypes["DateTime"]
};
	["RolesPermissionsResponse"]: {
	__typename: "RolesPermissionsResponse",
	permissions: Array<GraphQLTypes["PermissionDTO"]>,
	roles: Array<GraphQLTypes["RoleDTO"]>
};
	["SearchInput"]: {
		columns: Array<string>,
	filters?: Array<GraphQLTypes["FilterInput"]> | undefined | null,
	limit?: number | undefined | null,
	relations?: Array<string> | undefined | null,
	search: string
};
	["StudentProfileDto"]: {
	__typename: "StudentProfileDto",
	createdAt: GraphQLTypes["DateTime"],
	id: GraphQLTypes["ID"],
	schoolYear: number,
	studentId: number,
	updatedAt: GraphQLTypes["DateTime"]
};
	["SubjectEntity"]: {
	__typename: "SubjectEntity",
	createdAt: GraphQLTypes["DateTime"],
	id: GraphQLTypes["ID"],
	lessons?: Array<GraphQLTypes["LessonEntity"]> | undefined | null,
	name: string,
	topics?: Array<GraphQLTypes["TopicEntity"]> | undefined | null,
	updatedAt: GraphQLTypes["DateTime"],
	yearGroups?: Array<GraphQLTypes["YearGroupEntity"]> | undefined | null
};
	["SubmitIdArrayByIdRequestDto"]: {
		idArray: Array<number>,
	recordId: number
};
	["TopicByYearSubjectInput"]: {
		pagination?: GraphQLTypes["PaginationInput"] | undefined | null,
	subjectId: GraphQLTypes["ID"],
	withLessons: boolean,
	yearGroupId: GraphQLTypes["ID"]
};
	["TopicEntity"]: {
	__typename: "TopicEntity",
	createdAt: GraphQLTypes["DateTime"],
	id: GraphQLTypes["ID"],
	lessons?: Array<GraphQLTypes["LessonEntity"]> | undefined | null,
	name: string,
	subject: GraphQLTypes["SubjectEntity"],
	updatedAt: GraphQLTypes["DateTime"],
	yearGroup: GraphQLTypes["YearGroupEntity"]
};
	["UpdateAssignmentInput"]: {
		classId?: GraphQLTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	dueDate?: GraphQLTypes["DateTime"] | undefined | null,
	id: GraphQLTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateAssignmentSubmissionInput"]: {
		assignmentId?: GraphQLTypes["ID"] | undefined | null,
	feedback?: string | undefined | null,
	grade?: string | undefined | null,
	id: GraphQLTypes["ID"],
	studentId?: GraphQLTypes["ID"] | undefined | null,
	submissionContent?: string | undefined | null,
	submittedAt?: GraphQLTypes["DateTime"] | undefined | null
};
	["UpdateClassInput"]: {
		id: GraphQLTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateEducatorProfileInput"]: {
		id: number,
	staffId?: number | undefined | null
};
	["UpdateKeyStageInput"]: {
		description?: string | undefined | null,
	id: GraphQLTypes["ID"],
	name?: string | undefined | null
};
	["UpdateLessonInput"]: {
		content?: GraphQLTypes["JSONObject"] | undefined | null,
	createdByEducatorId?: GraphQLTypes["ID"] | undefined | null,
	description?: string | undefined | null,
	id: GraphQLTypes["ID"],
	recommendedYearGroupIds?: Array<GraphQLTypes["ID"]> | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null,
	title?: string | undefined | null
};
	["UpdateMultipleChoiceQuestionInput"]: {
		correctAnswer?: string | undefined | null,
	id: GraphQLTypes["ID"],
	lessonId?: GraphQLTypes["ID"] | undefined | null,
	options?: Array<string> | undefined | null,
	quizId?: GraphQLTypes["ID"] | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null,
	text?: string | undefined | null
};
	["UpdatePermissionGroupInput"]: {
		description?: string | undefined | null,
	id: number,
	name?: string | undefined | null
};
	["UpdatePermissionInput"]: {
		description?: string | undefined | null,
	id: number,
	name?: string | undefined | null
};
	["UpdateQuizInput"]: {
		description?: string | undefined | null,
	id: GraphQLTypes["ID"],
	lessonId?: GraphQLTypes["ID"] | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null,
	title?: string | undefined | null
};
	["UpdateRoleInput"]: {
		description?: string | undefined | null,
	id: number,
	name?: string | undefined | null
};
	["UpdateStudentProfileInput"]: {
		id: number,
	schoolYear?: number | undefined | null,
	studentId?: number | undefined | null
};
	["UpdateSubjectInput"]: {
		id: GraphQLTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateTopicInput"]: {
		id: GraphQLTypes["ID"],
	name?: string | undefined | null,
	/** Generic hook for attaching any relations by IDs */
	relationIds?: Array<GraphQLTypes["RelationIdsInput"]> | undefined | null
};
	["UpdateUserRolesFromArrayRequestDto"]: {
		publicId: string,
	roleIds: Array<number>
};
	["UpdateUserWithProfileInput"]: {
		addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	dateOfBirth?: GraphQLTypes["DateTime"] | undefined | null,
	educatorProfile?: GraphQLTypes["CreateEducatorProfileInput"] | undefined | null,
	email: string,
	firstName: string,
	lastName: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	publicId: string,
	studentProfile?: GraphQLTypes["CreateStudentProfileInput"] | undefined | null,
	userType: string
};
	["UpdateYearGroupInput"]: {
		id: GraphQLTypes["ID"],
	keyStageId?: GraphQLTypes["ID"] | undefined | null,
	year?: GraphQLTypes["ValidYear"] | undefined | null
};
	["User"]: {
	__typename: "User",
	addressLine1?: string | undefined | null,
	addressLine2?: string | undefined | null,
	city?: string | undefined | null,
	country?: string | undefined | null,
	county?: string | undefined | null,
	createdAt: GraphQLTypes["DateTime"],
	dateOfBirth?: GraphQLTypes["DateTime"] | undefined | null,
	educatorProfile?: GraphQLTypes["EducatorProfileDto"] | undefined | null,
	email: string,
	firstName: string,
	id: GraphQLTypes["ID"],
	lastName: string,
	phoneNumber?: string | undefined | null,
	postalCode?: string | undefined | null,
	publicId: string,
	roles?: Array<GraphQLTypes["Role"]> | undefined | null,
	studentProfile?: GraphQLTypes["StudentProfileDto"] | undefined | null,
	updatedAt: GraphQLTypes["DateTime"],
	userType: string
};
	["UserDetails"]: {
	__typename: "UserDetails",
	permissions: Array<string>,
	publicId: string
};
	["UserPermissionsInput"]: {
		publicId: string
};
	/** National Curriculum Key Stage (3, 4 or 5) */
["ValidKeyStage"]: ValidKeyStage;
	["ValidYear"]: ValidYear;
	["YearGroupEntity"]: {
	__typename: "YearGroupEntity",
	createdAt: GraphQLTypes["DateTime"],
	id: GraphQLTypes["ID"],
	keyStage?: GraphQLTypes["KeyStageEntity"] | undefined | null,
	subjects?: Array<GraphQLTypes["SubjectEntity"]> | undefined | null,
	topics?: Array<GraphQLTypes["TopicEntity"]> | undefined | null,
	updatedAt: GraphQLTypes["DateTime"],
	year: GraphQLTypes["ValidYear"]
};
	["ID"]: "scalar" & { name: "ID" }
    }
/** National Curriculum Key Stage (3, 4 or 5) */
export enum ValidKeyStage {
	KS3 = "KS3",
	KS4 = "KS4",
	KS5 = "KS5"
}
export enum ValidYear {
	Year7 = "Year7",
	Year8 = "Year8",
	Year9 = "Year9",
	Year10 = "Year10",
	Year11 = "Year11",
	Year12 = "Year12",
	Year13 = "Year13"
}

type ZEUS_VARIABLES = {
	["ClassByYearSubjectInput"]: ValueTypes["ClassByYearSubjectInput"];
	["CreateAssignmentInput"]: ValueTypes["CreateAssignmentInput"];
	["CreateAssignmentSubmissionInput"]: ValueTypes["CreateAssignmentSubmissionInput"];
	["CreateClassInput"]: ValueTypes["CreateClassInput"];
	["CreateEducatorProfileInput"]: ValueTypes["CreateEducatorProfileInput"];
	["CreateKeyStageInput"]: ValueTypes["CreateKeyStageInput"];
	["CreateLessonInput"]: ValueTypes["CreateLessonInput"];
	["CreateMultipleChoiceQuestionInput"]: ValueTypes["CreateMultipleChoiceQuestionInput"];
	["CreatePermissionGroupInput"]: ValueTypes["CreatePermissionGroupInput"];
	["CreatePermissionInput"]: ValueTypes["CreatePermissionInput"];
	["CreateQuizInput"]: ValueTypes["CreateQuizInput"];
	["CreateRoleInput"]: ValueTypes["CreateRoleInput"];
	["CreateStudentProfileInput"]: ValueTypes["CreateStudentProfileInput"];
	["CreateSubjectInput"]: ValueTypes["CreateSubjectInput"];
	["CreateTopicInput"]: ValueTypes["CreateTopicInput"];
	["CreateUserRequestDto"]: ValueTypes["CreateUserRequestDto"];
	["CreateUserWithProfileInput"]: ValueTypes["CreateUserWithProfileInput"];
	["CreateYearGroupInput"]: ValueTypes["CreateYearGroupInput"];
	["DateTime"]: ValueTypes["DateTime"];
	["FilterInput"]: ValueTypes["FilterInput"];
	["FindAllInput"]: ValueTypes["FindAllInput"];
	["FindOneByInput"]: ValueTypes["FindOneByInput"];
	["IdInput"]: ValueTypes["IdInput"];
	["IdRequestDto"]: ValueTypes["IdRequestDto"];
	["JSONObject"]: ValueTypes["JSONObject"];
	["LoginRequest"]: ValueTypes["LoginRequest"];
	["PaginatedGetAllRequestDto"]: ValueTypes["PaginatedGetAllRequestDto"];
	["PaginationInput"]: ValueTypes["PaginationInput"];
	["PublicIdRequestDto"]: ValueTypes["PublicIdRequestDto"];
	["RelationIdsInput"]: ValueTypes["RelationIdsInput"];
	["SearchInput"]: ValueTypes["SearchInput"];
	["SubmitIdArrayByIdRequestDto"]: ValueTypes["SubmitIdArrayByIdRequestDto"];
	["TopicByYearSubjectInput"]: ValueTypes["TopicByYearSubjectInput"];
	["UpdateAssignmentInput"]: ValueTypes["UpdateAssignmentInput"];
	["UpdateAssignmentSubmissionInput"]: ValueTypes["UpdateAssignmentSubmissionInput"];
	["UpdateClassInput"]: ValueTypes["UpdateClassInput"];
	["UpdateEducatorProfileInput"]: ValueTypes["UpdateEducatorProfileInput"];
	["UpdateKeyStageInput"]: ValueTypes["UpdateKeyStageInput"];
	["UpdateLessonInput"]: ValueTypes["UpdateLessonInput"];
	["UpdateMultipleChoiceQuestionInput"]: ValueTypes["UpdateMultipleChoiceQuestionInput"];
	["UpdatePermissionGroupInput"]: ValueTypes["UpdatePermissionGroupInput"];
	["UpdatePermissionInput"]: ValueTypes["UpdatePermissionInput"];
	["UpdateQuizInput"]: ValueTypes["UpdateQuizInput"];
	["UpdateRoleInput"]: ValueTypes["UpdateRoleInput"];
	["UpdateStudentProfileInput"]: ValueTypes["UpdateStudentProfileInput"];
	["UpdateSubjectInput"]: ValueTypes["UpdateSubjectInput"];
	["UpdateTopicInput"]: ValueTypes["UpdateTopicInput"];
	["UpdateUserRolesFromArrayRequestDto"]: ValueTypes["UpdateUserRolesFromArrayRequestDto"];
	["UpdateUserWithProfileInput"]: ValueTypes["UpdateUserWithProfileInput"];
	["UpdateYearGroupInput"]: ValueTypes["UpdateYearGroupInput"];
	["UserPermissionsInput"]: ValueTypes["UserPermissionsInput"];
	["ValidKeyStage"]: ValueTypes["ValidKeyStage"];
	["ValidYear"]: ValueTypes["ValidYear"];
	["ID"]: ValueTypes["ID"];
}