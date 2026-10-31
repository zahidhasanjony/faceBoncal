import {Config} from '@remotion/cli/config';
Config.setOverwriteOutput(true);
// These settings are safe on GitHub-hosted Linux runners with limited RAM.
Config.setConcurrency(2);
