const path = require('path');
const fs = require('fs');
const createBouquet = require('./createBouquet.cjs');
const createFolder = require('./createFolder.cjs');
const renameItem = require('./renameItem.cjs');
const deleteItem = require('./deleteItem.cjs');
const copyItem = require('./copyItem.cjs');
const moveItem = require('./moveItem.cjs');

const PROJECTS_ROOT = path.join(process.cwd(), 'Projects');

const FileSystemManager = {
    handlePasteItem: async (event, { srcPath, destDir, action }) => {
        try {
            const path = require('path');
            const fs = require('fs');
            let fullSrcPath;
            // исправление путей
            if (srcPath.startsWith('\\') || srcPath.startsWith('/') || !srcPath.includes(':\\')) {
                const cleanSrc = srcPath.replace(/^([\\/.]+)+/, '');
                fullSrcPath = path.join(PROJECTS_ROOT, cleanSrc);
            } else {
                fullSrcPath = srcPath;
            }
            let fullDestDir;
            if (!destDir || destDir === '/' || destDir === '\\' || destDir === '') {
                fullDestDir = PROJECTS_ROOT;
            } else if (destDir.startsWith('\\') || destDir.startsWith('/') || !destDir.includes(':\\')) {
                const cleanDest = destDir.replace(/^([\\/.]+)+/, '');
                fullDestDir = path.join(PROJECTS_ROOT, cleanDest);
            } else {
                fullDestDir = destDir;
            }
            const fileName = path.basename(fullSrcPath);
            const fullDestPath = path.join(fullDestDir, fileName);
            if (!fs.existsSync(fullSrcPath)) {
                throw new Error(`handlePasteItem error - путь fullSrcPath - ${fullSrcPath}`);
            }
            if (fullSrcPath === fullDestPath) {
                if (action === 'cut') return fullSrcPath;
            }
            if (action === 'cut') {
                return await moveItem(fullSrcPath, fullDestPath);
            } else {
                return await copyItem(fullSrcPath, fullDestPath);
            }
        } catch (error) {
            console.error("handlePasteItem error - ошибка вставки", error);
            throw error;
        }
    },

    handleCreateBouquet: async (event, targetDir) => {
        const cleanTarget = targetDir.replace(/^[\\/]+/, '');
        return await createBouquet(PROJECTS_ROOT, cleanTarget);
    },

    handleCreateFolder: async (event, targetDir) => {
        const cleanTarget = targetDir.replace(/^[\\/]+/, '');
        return await createFolder(PROJECTS_ROOT, cleanTarget);
    },

    handleRenameItem: async (event, oldPath, newName) => {
        try {
            let fullOldPath;
            // исправление пути
            if (oldPath.startsWith('\\') || oldPath.startsWith('/') || !oldPath.includes(':\\')) {
                const cleanPath = oldPath.replace(/^([\\/.]+)+/, '');
                fullOldPath = path.join(PROJECTS_ROOT, cleanPath);
            } else {
                fullOldPath = oldPath;
            }
            if (!fs.existsSync(fullOldPath)) {
                throw new Error(`index.cjs - handleRenameItem error - старый путь- ${fullOldPath}`);
            }
            return await renameItem(fullOldPath, newName);
        } catch (error) {
            console.error('index.cjs - handleRenameItem', error);
            throw error;
        }
    },

    handleDeleteItem: async (event, oldPath) => {
        try {
            let fullPath = oldPath;
            if (!path.isAbsolute(oldPath)) {
                const cleanPath = oldPath.replace(/^([\\/.]+)+/, '');
                fullPath = path.resolve(PROJECTS_ROOT, cleanPath);
            }
            
            if (!fs.existsSync(fullPath)) {
                throw new Error(`index.cjs - handleDeleteItem error - путь не найден - ${fullPath}`);
            }

            return await deleteItem(fullPath);
        } catch (error) {
            console.error('index.cjs - handleDeleteItem error', error);
            throw error;
        }
    }
};

module.exports = FileSystemManager;