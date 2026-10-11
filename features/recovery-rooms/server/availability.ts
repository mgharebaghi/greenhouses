import "server-only";
import { FeatureUnavailableError } from "@/server/actions/feature-unavailable";
import { RECOVERY_UNAVAILABLE_MESSAGE } from "../domain/availability";

export function requireRecoveryStorage(): never {
  throw new FeatureUnavailableError(RECOVERY_UNAVAILABLE_MESSAGE);
}
