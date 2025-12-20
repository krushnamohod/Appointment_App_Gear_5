import redis from "../utils/redis.js";

export async function unlockSlot(req, res) {
  const { slotId } = req.body;
  const userId = req.user.id;

  const lockKey = `slot:${slotId}`;
  const lockedBy = await redis.get(lockKey);

  if (!lockedBy) {
    return res.json({ message: "Slot already unlocked" });
  }

  if (lockedBy !== userId) {
    return res.status(403).json({
      message: "You cannot unlock a slot locked by another user",
    });
  }

  await redis.del(lockKey);
  return res.json({ message: "Slot unlocked successfully" });
}
