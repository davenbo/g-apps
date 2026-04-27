/**
 * Returns a map of { folderName → Folder } for all immediate children
 * of the given parent folder.
 *
 * @param {DriveApp.Folder} parentFolder
 * @returns {Object.<string, DriveApp.Folder>}
 */
function buildFolderMap(parentFolder) {
  const map = {};
  const it  = parentFolder.getFolders();
  while (it.hasNext()) {
    const f = it.next();
    map[f.getName()] = f;
  }
  return map;
}

/**
 * Returns the employee's Drive folder, creating it (and a notes doc) if it
 * doesn't exist yet. Updates folderMap in place.
 *
 * NOTE: Moving the notes doc into the new folder uses the advanced Drive
 * service (Drive.Files.update). After duplicating this script project you
 * must re-enable it under Extensions → Apps Script → Services → Drive API.
 * If it isn't enabled the folder will still be created; only the doc move fails.
 *
 * @param {DriveApp.Folder} parentFolder
 * @param {Object.<string, DriveApp.Folder>} folderMap - mutated in place
 * @param {string} upperId
 * @returns {DriveApp.Folder}
 */
function ensureEmployeeFolder(parentFolder, folderMap, upperId) {
  if (folderMap[upperId]) return folderMap[upperId];

  const newFolder = parentFolder.createFolder(upperId);

  try {
    const doc     = DocumentApp.create(`${upperId}${CONFIG.NOTES_DOC_SUFFIX}`);
    const docFile = DriveApp.getFileById(doc.getId());
    try {
      Drive.Files.update(
        { parents: [{ id: newFolder.getId() }] },
        docFile.getId()
      );
    } catch (e) {
      Logger.log(`Could not move notes doc for ${upperId} — is Drive API enabled? ${e}`);
    }
  } catch (e) {
    Logger.log(`Could not create notes doc for ${upperId}: ${e}`);
  }

  folderMap[upperId] = newFolder;
  return newFolder;
}
