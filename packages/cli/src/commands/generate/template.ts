import * as path from "path";
import { Command, Flags } from "@oclif/core";
import { t } from "i18next";
import { getDirectory } from "../../domains/generate/directory";
import { getProjectName } from "../../domains/generate/project-name";
import { inheritTheme } from "../../domains/generate/theme";

export default class GenerateTemplate extends Command {
  static override description = t("command.generate_template.description");

  static override examples = ["<%= config.bin %> <%= command.id %>"];

  static override flags = {
    output: Flags.string({
      name: "output",
      default: ".",
      description: t("command.generate_template.flag.output"),
      required: false,
      multiple: false,
      parse: async (directory: string): Promise<string> => {
        // Sanitize the directory input to prevent path traversal
        const sanitizedDirectory = path.normalize(directory).replace(/^(\.\.[\/\\])+/, '');
        return path.resolve(sanitizedDirectory);
      },
    }),
  };

  static override args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(GenerateTemplate);

    const integrationPath = await getDirectory(
      t("command.generate_template.input.integration_path")
    );

    const projectName = await getProjectName(
      t("command.generate_template.input.project_name")
    );

    // Sanitize the projectName to prevent path traversal
    const sanitizedProjectName = path.normalize(projectName).replace(/^(\.\.[\/\\])+/, '');
    const projectPath = path.join(flags.output, sanitizedProjectName);

    await inheritTheme({
      projectPath,
      integrationPath,
    });

    this.log(
      t("command.generate_template.message.success", {
        projectName: projectPath,
      })
    );
    this.exit(0);
  }
}
