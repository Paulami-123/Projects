import { Redis } from "ioredis";

export const redisClient = new Redis("rediss://default:9780036d9984427ca3021e1d425d7851@gusc1-driving-goat-30632.upstash.io:30632");