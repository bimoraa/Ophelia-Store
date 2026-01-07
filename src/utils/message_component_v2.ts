/**
 * - MESSAGE COMPONENT V2 BUILDER UTILITY - \\
 */

/**
 * Component v2 types
 */
export enum ComponentV2Type {
    CONTAINER = 17,
    SECTION   = 9,
    TEXT      = 10,
    MEDIA     = 11
}

interface TextComponent {
    type:    ComponentV2Type.TEXT;
    content: string;
}

interface MediaAccessory {
    type:  ComponentV2Type.MEDIA;
    media: {
        url: string;
    };
}

interface SectionComponent {
    type:       ComponentV2Type.SECTION;
    components: TextComponent[];
    accessory?: MediaAccessory;
}

interface ContainerComponent {
    type:       ComponentV2Type.CONTAINER;
    components: SectionComponent[];
}

interface MessageComponentV2 {
    flags:      number;
    components: ContainerComponent[];
}

/**
 * - COMPONENT V2 BUILDER CLASS - \\
 */
export class ComponentV2Builder {
    private message: MessageComponentV2;

    constructor(flags: number = 32768) {
        this.message = {
            flags:      flags,
            components: []
        };
    }

    /**
     * @param {Function} callback - Callback to configure container
     * @returns {ComponentV2Builder} Builder instance for chaining
     */
    add_container(callback: (container: ContainerBuilder) => void): this {
        const container_builder = new ContainerBuilder();
        callback(container_builder);
        this.message.components.push(container_builder.build());
        return this;
    }

    /**
     * @returns {MessageComponentV2} Built message component
     */
    build(): MessageComponentV2 {
        return this.message;
    }
}

/**
 * - CONTAINER BUILDER CLASS - \\
 */
class ContainerBuilder {
    private container: ContainerComponent;

    constructor() {
        this.container = {
            type:       ComponentV2Type.CONTAINER,
            components: []
        };
    }

    /**
     * @param {Function} callback - Callback to configure section
     * @returns {ContainerBuilder} Builder instance for chaining
     */
    add_section(callback: (section: SectionBuilder) => void): this {
        const section_builder = new SectionBuilder();
        callback(section_builder);
        this.container.components.push(section_builder.build());
        return this;
    }

    /**
     * @returns {ContainerComponent} Built container component
     */
    build(): ContainerComponent {
        return this.container;
    }
}

/**
 * - SECTION BUILDER CLASS - \\
 */
class SectionBuilder {
    private section: SectionComponent;

    constructor() {
        this.section = {
            type:       ComponentV2Type.SECTION,
            components: []
        };
    }

    /**
     * @param {string} content - Markdown text content
     * @returns {SectionBuilder} Builder instance for chaining
     */
    add_text(content: string): this {
        this.section.components.push({
            type:    ComponentV2Type.TEXT,
            content: content
        });
        return this;
    }

    /**
     * @param {string} url - Media/image URL
     * @returns {SectionBuilder} Builder instance for chaining
     */
    add_media(url: string): this {
        this.section.accessory = {
            type:  ComponentV2Type.MEDIA,
            media: {
                url: url
            }
        };
        return this;
    }

    /**
     * @returns {SectionComponent} Built section component
     */
    build(): SectionComponent {
        return this.section;
    }
}

/**
 * @param {number} flags - Message flags (default: 32768)
 * @returns {ComponentV2Builder} New component v2 builder instance
 */
export const create_component_v2 = (flags: number = 32768): ComponentV2Builder => {
    return new ComponentV2Builder(flags);
};

/**
 * - HELPER FUNCTIONS FOR QUICK MESSAGE CREATION - \\
 */

/**
 * @param {string} content - Text content
 * @param {string} image_url - Optional image URL
 * @returns {MessageComponentV2} Simple message with text and optional image
 */
export const create_simple_message = (
    content:   string,
    image_url?: string
): MessageComponentV2 => {
    return create_component_v2()
        .add_container(container => {
            container.add_section(section => {
                section.add_text(content);
                if (image_url) {
                    section.add_media(image_url);
                }
            });
        })
        .build();
};

/**
 * @param {string} title - Title text
 * @param {string} description - Description text
 * @param {string} image_url - Optional image URL
 * @returns {MessageComponentV2} Message with title and description
 */
export const create_titled_message = (
    title:       string,
    description: string,
    image_url?:  string
): MessageComponentV2 => {
    const content = `## ${title}\n${description}`;
    return create_simple_message(content, image_url);
};

/**
 * @param {Array<{content: string, image_url?: string}>} sections_data - Array of section data
 * @returns {MessageComponentV2} Message with multiple sections
 */
export const create_multi_section_message = (
    sections_data: Array<{content: string; image_url?: string}>
): MessageComponentV2 => {
    return create_component_v2()
        .add_container(container => {
            sections_data.forEach(data => {
                container.add_section(section => {
                    section.add_text(data.content);
                    if (data.image_url) {
                        section.add_media(data.image_url);
                    }
                });
            });
        })
        .build();
};
