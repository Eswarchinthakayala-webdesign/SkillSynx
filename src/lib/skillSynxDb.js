import { puter } from '@heyputer/puter.js';

// Base Directory for SkillSynx App Data
const APP_BASE_DIR = 'SkillSynx';
const USERS_DIR = `${APP_BASE_DIR}/users`;

/**
 * Utility to ensure a directory exists.
 * @param {string} path - The directory path to check/create.
 */
const ensureDir = async (path) => {
    try {
        await puter.fs.mkdir(path, { recursive: true });
    } catch (error) {
        // Ignore error if directory already exists
        if (error.code !== 'EEXIST') {
            console.error(`Error ensuring directory ${path}:`, error);
        }
    }
};

/**
 * Utility to write JSON data to a file.
 * @param {string} path - The file path.
 * @param {object} data - The data to serialize and write.
 */
const writeJson = async (path, data) => {
    try {
        await puter.fs.write(path, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing JSON to ${path}:`, error);
        throw new Error(`Failed to save data: ${error.message}`);
    }
};

/**
 * Utility to read JSON data from a file.
 * @param {string} path - The file path.
 * @returns {object|null} - The parsed JSON data or null if not found.
 */
const readJson = async (path) => {
    try {
        const content = await puter.fs.read(path);
        // puter.fs.read typically returns a string or Blob. Assuming string or handling conversion.
        const text = content instanceof Blob ? await content.text() : content;
        return JSON.parse(text);
    } catch (error) {
        // Return null if file not found or read error
        return null;
    }
};

export const skillSynxDb = {
    /**
     * initializes the user's storage structure on Puter.js filesystem.
     * Creates: /SkillSynx/users/{userId}/resumes and /SkillSynx/users/{userId}/analyses
     * @param {string} userId - Unique identifier for the user (from Auth).
     */
    async initializeUserStorage(userId) {
        if (!userId) throw new Error("userId is required");
        
        const userBase = `${USERS_DIR}/${userId}`;
        await ensureDir(userBase);
        await ensureDir(`${userBase}/resumes`);
        await ensureDir(`${userBase}/analyses`);
        return true;
    },

    /**
     * Saves or updates the user's profile data.
     * Path: /SkillSynx/users/{userId}/profile.json
     * @param {string} userId 
     * @param {object} profileData 
     */
    async saveUserProfile(userId, profileData) {
        if (!userId) throw new Error("userId is required");
        
        // Ensure directory exists
        await ensureDir(`${USERS_DIR}/${userId}`);

        const path = `${USERS_DIR}/${userId}/profile.json`;
        return await writeJson(path, {
            ...profileData,
            updatedAt: new Date().toISOString()
        });
    },

    /**
     * Gets the user's profile data.
     * @param {string} userId 
     */
    async getUserProfile(userId) {
         if (!userId) throw new Error("userId is required");
         const path = `${USERS_DIR}/${userId}/profile.json`;
         return await readJson(path);
    },

    /**
     * Saves metadata for an uploaded resume.
     * Path: /SkillSynx/users/{userId}/resumes/{resumeId}.json
     * @param {string} userId 
     * @param {object} resumeMetadata - Should include filename, uploadTimestamp, etc.
     */
    async saveResumeMetadata(userId, resumeMetadata) {
        if (!userId) throw new Error("userId is required");
        
        const resumeId = resumeMetadata.id || crypto.randomUUID();
        const data = {
            id: resumeId,
            ...resumeMetadata,
            createdAt: new Date().toISOString()
        };

        // Ensure directory exists
        await ensureDir(`${USERS_DIR}/${userId}/resumes`);

        const path = `${USERS_DIR}/${userId}/resumes/${resumeId}.json`;
        await writeJson(path, data);
        return data; // Return with ID
    },

    /**
     * Uploads the raw resume file (PDF, DOCX, TXT, etc.)
     * Path: /SkillSynx/users/{userId}/resumes/files/{filename}
     * @param {string} userId
     * @param {File} file
     */
    async uploadResumeFile(userId, file) {
        if (!userId) throw new Error("userId is required");

        const resumeId = crypto.randomUUID();
        const extension = file.name.split('.').pop();
        const fileName = `${resumeId}.${extension}`;
        
        // Ensure files directory exists
        const userBase = `${USERS_DIR}/${userId}`;
        await ensureDir(`${userBase}/resumes/files`);
        
        const path = `${userBase}/resumes/files/${fileName}`;
        
        await puter.fs.write(path, file);
        
        return {
            id: resumeId,
            fileName: file.name,
            path: path,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
        };
    },

    /**
     * Saves the result of a resume analysis.
     * Path: /SkillSynx/users/{userId}/analyses/{analysisId}.json
     * @param {string} userId 
     * @param {object} analysisResult - The AI analysis output (ATS score, skills, etc.)
     * @param {string} resumeId - ID of the resume analyzed
     */
    async saveResumeAnalysis(userId, analysisResult, resumeId) {
        if (!userId) throw new Error("userId is required");

        const analysisId = crypto.randomUUID();
        const data = {
            id: analysisId,
            resumeId: resumeId,
            ...analysisResult,
            analyzedAt: new Date().toISOString()
        };

        // Ensure directory exists
        await ensureDir(`${USERS_DIR}/${userId}/analyses`);

        const path = `${USERS_DIR}/${userId}/analyses/${analysisId}.json`;
        await writeJson(path, data);
        return data;
    },

    /**
     * Fetches the analysis history for a user.
     * Reads all JSON files in /SkillSynx/users/{userId}/analyses/
     * @param {string} userId 
     */
    async getAnalysisHistory(userId) {
        if (!userId) throw new Error("userId is required");

        const analysesDir = `${USERS_DIR}/${userId}/analyses`;
        
        // Ensure directory exists to avoid 404 on readdir for new users
        await ensureDir(analysesDir);

        try {
            const files = await puter.fs.readdir(analysesDir);
            
            const analysisPromises = files.map(async (file) => {
                const fileName = typeof file === 'string' ? file : file.name;
                 if (fileName.endsWith('.json')) {
                    return await readJson(`${analysesDir}/${fileName}`);
                 }
                 return null;
            });

            const results = await Promise.all(analysisPromises);
            return results.filter(Boolean).sort((a, b) => 
                new Date(b.analyzedAt) - new Date(a.analyzedAt)
            );
        } catch (error) {
            // Directory likely doesn't exist
            return [];
        }
    }
};

export default skillSynxDb;
