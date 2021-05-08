/** @module app/utils */

/**
 * Rename a property in the target object i.e.
 * change the key to a new name.
 * @param target Target object
 * @param oldName Old name/key of the property
 * @param newName New name/key of the property
 */
export function renameObjectProp(
  target: object,
  oldName: string,
  newName: string,
) {
  if (oldName in target) {
    target[newName] = target[oldName];
    delete target[oldName];
  }
}
