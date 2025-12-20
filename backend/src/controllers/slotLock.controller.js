import redis from "../utils/redis.js";

const LOCK_TTL = 300; // 5 minutes

export async function lockSlot(req, res) {
  const { slotId } = req.body;
  const userId = req.user.id;

  if (!slotId) {
    return res.status(400).json({ message: "slotId required" });
  }

  const lockKey = `slot:${slotId}`;

  // SET key value NX EX seconds
  const result = await redis.set(
    lockKey,
    userId,
    "NX",
    "EX",
    LOCK_TTL
  );

  if (!result) {
    return res.status(409).json({
      message: "Slot is temporarily locked by another user",
    });
  }

  return res.json({
    message: "Slot locked successfully",
    expiresInSeconds: LOCK_TTL,
  });
}
