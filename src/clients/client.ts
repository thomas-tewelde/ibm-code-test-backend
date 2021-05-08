/** @module app/clients */

/**
 * `IClientExport<IClient>` is the interface exported by each
 * client module within this directory/namespace.
 *
 * It emulates pointer behaviour in other languages e.g. C/C++.
 * An object is used to allow consumers to lookup the client
 * instance without using a function invocation.
 * Once a client is setup, the created client instance is
 * registered on the object.
 *
 * This is a work-around since a variable of a basic/primitive
 * type, once exported, can not be updated. It is constant.
 * Consumers can not see any changes made in the variable's
 * value (through assignments).
 */
export interface IClientExport<IClient> {
  $?: IClient;
}
