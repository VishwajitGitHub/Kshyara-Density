export interface ToolMetadata {
  name: string;
  description: string;
  category: string;
  parameters: Record<string, any>;
}

export abstract class BaseTool {
  abstract metadata: ToolMetadata;
  abstract execute(args: any): Promise<any>;
}

export class ToolRegistry {
  private tools: Map<string, BaseTool> = new Map();

  public register(tool: BaseTool) {
    this.tools.set(tool.metadata.name, tool);
  }

  public getTool(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }

  public listTools(): ToolMetadata[] {
    return Array.from(this.tools.values()).map(t => t.metadata);
  }

  public getByCategory(category: string): ToolMetadata[] {
    return this.listTools().filter(t => t.category === category);
  }
}

export const toolRegistry = new ToolRegistry();
