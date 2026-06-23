import { useConfigurables } from "~/modules/configurables";
import {
  defaultConfigurablesData,
  type TDefaultConfigurableData,
} from "~/modules/configurables/src/constants/configurables.default";

/**
 * Returns the merged configurables data with defaults filled in for any field
 * the live config has not provided yet (prevents undefined access during the
 * brief window before the provider hydrates).
 */
export function useFestaConfig(): { config: TDefaultConfigurableData; loading: boolean } {
  const { config, loading } = useConfigurables();
  const merged = {
    ...defaultConfigurablesData,
    ...(config || {}),
  } as TDefaultConfigurableData;
  return { config: merged, loading };
}
