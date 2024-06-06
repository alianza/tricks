import { PREFFERED_STANCES } from '../models/constants/stances';

/**
 * @typedef {Object} FlatgroundTrick
 * @property {string} [_id]
 * @property {string} name
 * @property {string} stance
 * @property {string} direction
 * @property {number} rotation
 * @property {boolean} [landed=false]
 * @property {PREFFERED_STANCES} [preferred_stance]
 * @property {string} [landedAt]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 * @property {string} [userId]
 */

/**
 * @typedef {Object} Grind
 * @property {string} [_id]
 * @property {string} name
 * @property {string} stance
 * @property {string} direction
 * @property {boolean} [landed=false]
 * @property {PREFFERED_STANCES} [preferred_stance]
 * @property {string} [landedAt]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 * @property {string} [userId]
 */

/**
 * @typedef {Object} Manual
 * @property {string} [_id]
 * @property {string} type
 * @property {string} [stance]
 * @property {boolean} [landed=false]
 * @property {PREFFERED_STANCES} [preferred_stance]
 * @property {string} [landedAt]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 * @property {string} [userId]
 */

/**
 * @typedef {Object} Combo
 * @property {string} [_id]
 * @property {Array<FlatgroundTrick|Grind|Manual|TrickRef>} trickArray
 * @property {boolean} [landed=false]
 * @property {string} [landedAt]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 * @property {string} [userId]
 * @property {string} [trick]
 */

/**
 * @typedef {Object} TrickRef
 * @property {string} trick
 * @property {string} trickRef
 */

/**
 * @typedef {Object} Profile
 * @property {string} [_id]
 * @property {string} userId
 * @property {PREFFERED_STANCES} preferred_stance
 */

/**
 * @typedef {Parameters<Parameters<T["create"]>["1"]>["1"]} ModelType<T>
 * @extends {import('mongoose').Model} This is probably unnecessary
 * @template T
 */
