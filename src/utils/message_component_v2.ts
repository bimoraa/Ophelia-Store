// - Discord component v2 builder utilities - \\

export enum component_type {
  action_row = 1,
  button = 2,
  string_select = 3,
  text_input = 4,
  user_select = 5,
  role_select = 6,
  mentionable_select = 7,
  channel_select = 8,
  section = 9,
  text = 10,
  thumbnail = 11,
  media_gallery = 12,
  file = 13,
  divider = 14,
  separator = 14,
  content_inventory_entry = 16,
  container = 17,
}

export enum button_style {
  primary = 1,
  secondary = 2,
  success = 3,
  danger = 4,
  link = 5,
}

export interface button_component {
  type: number
  style: number
  label: string
  custom_id?: string
  url?: string
  emoji?: { id?: string; name: string }
  disabled?: boolean
}

export interface action_row_component {
  type: number
  components: button_component[] | select_menu_component[]
}

export interface select_option {
  label: string
  value: string
  description?: string
  emoji?: { id?: string; name: string }
  default?: boolean
}

export interface select_menu_component {
  type: number
  custom_id: string
  placeholder?: string
  options?: select_option[]
  min_values?: number
  max_values?: number
}

export interface thumbnail_component {
  type: number
  media: { url: string }
}

export interface text_component {
  type: number
  content: string
}

export interface media_component {
  type: number
  media: { url: string }
}

export interface section_component {
  type: number
  components: text_component[]
  accessory?: thumbnail_component | button_component | media_component
}

export interface divider_component {
  type: number
  spacing?: number
  divider?: boolean
}

export interface container_component {
  type: number
  components: (section_component | text_component | divider_component | action_row_component)[]
  accent_color?: number | { r: number; g: number; b: number } | null
  spoiler?: boolean
}

export interface message_payload {
  flags?: number
  content?: string
  components: (container_component | text_component | file_component)[]
}

/**
 * @param {string} label - Button label
 * @param {string} custom_id - Custom identifier
 * @param {{ id?: string; name: string }} emoji - Optional emoji
 * @param {boolean} disabled - Whether button is disabled
 * @returns {button_component} Primary styled button
 */
export function primary_button(label: string, custom_id: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.primary,
    label,
    custom_id,
    emoji,
    disabled,
  }
}

/**
 * @param {string} label - Button label
 * @param {string} custom_id - Custom identifier
 * @param {{ id?: string; name: string }} emoji - Optional emoji
 * @param {boolean} disabled - Whether button is disabled
 * @returns {button_component} Secondary styled button
 */
export function secondary_button(label: string, custom_id: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.secondary,
    label,
    custom_id,
    emoji,
    disabled,
  }
}

/**
 * @param {string} label - Button label
 * @param {string} custom_id - Custom identifier
 * @param {{ id?: string; name: string }} emoji - Optional emoji
 * @param {boolean} disabled - Whether button is disabled
 * @returns {button_component} Success styled button
 */
export function success_button(label: string, custom_id: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.success,
    label,
    custom_id,
    emoji,
    disabled,
  }
}

/**
 * @param {string} label - Button label
 * @param {string} custom_id - Custom identifier
 * @param {{ id?: string; name: string }} emoji - Optional emoji
 * @param {boolean} disabled - Whether button is disabled
 * @returns {button_component} Danger styled button
 */
export function danger_button(label: string, custom_id: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.danger,
    label,
    custom_id,
    emoji,
    disabled,
  }
}

/**
 * @param {string} label - Button label
 * @param {string} url - Link URL
 * @param {{ id?: string; name: string }} emoji - Optional emoji
 * @param {boolean} disabled - Whether button is disabled
 * @returns {button_component} Link styled button
 */
export function link_button(label: string, url: string, emoji?: { id?: string; name: string }, disabled?: boolean): button_component {
  return {
    type: component_type.button,
    style: button_style.link,
    label,
    url,
    emoji,
    disabled,
  }
}

export function action_row(...components: button_component[]): action_row_component {
  return {
    type: component_type.action_row,
    components,
  }
}

export function select_menu(custom_id: string, placeholder: string, options: select_option[]): action_row_component {
  return {
    type: component_type.action_row,
    components: [
      {
        type: component_type.string_select,
        custom_id,
        placeholder,
        options,
      },
    ],
  }
}

export interface user_select_component {
  type       : number
  custom_id  : string
  placeholder: string
  min_values?: number
  max_values?: number
}

export function user_select(custom_id: string, placeholder: string): action_row_component {
  return {
    type: component_type.action_row,
    components: [
      {
        type        : component_type.user_select,
        custom_id,
        placeholder,
      },
    ],
  }
}

/**
 * @param {string} url - Media URL
 * @returns {thumbnail_component} Thumbnail/media component
 */
export function thumbnail(url: string): thumbnail_component {
  return {
    type: component_type.thumbnail,
    media: { url },
  }
}

/**
 * @param {string} url - Media URL
 * @returns {media_component} Media component (type 11)
 */
export function media(url: string): media_component {
  return {
    type: component_type.thumbnail,
    media: { url },
  }
}

export function text(content: string | string[]): text_component {
  return {
    type: component_type.text,
    content: Array.isArray(content) ? content.join("\n") : content,
  }
}

/**
 * @param {object} options - Section options
 * @param {string | string[]} options.content - Text content
 * @param {string} options.thumbnail - Thumbnail URL (type 11)
 * @param {string} options.media - Media URL (type 11)
 * @param {button_component} options.button - Button accessory
 * @returns {section_component} Section component
 */
export function section(options: {
  content: string | string[]
  thumbnail?: string
  media?: string
  button?: button_component
}): section_component {
  const result: section_component = {
    type       : component_type.section,
    components : [text(options.content)],
  }

  if (options.button) {
    result.accessory = options.button
  } else {
    const media_url = options.media || options.thumbnail

    if (media_url && typeof media_url === "string" && media_url.trim().length > 0) {
      result.accessory = {
        type  : component_type.thumbnail,
        media : { url: media_url },
      }
    }
  }

  return result
}

export function divider(spacing?: number): divider_component {
  const result: divider_component = {
    type: component_type.divider,
  }

  if (spacing !== undefined) {
    result.spacing = spacing
  }

  return result
}

export function separator(spacing?: number): divider_component {
  return divider(spacing)
}

export function container(options: {
  components: (section_component | text_component | divider_component | action_row_component)[]
  accent_color?: number | { r: number; g: number; b: number } | null
  spoiler?: boolean
}): container_component {
  let processed_color = options.accent_color

  if (
    options.accent_color &&
    typeof options.accent_color === "object" &&
    "r" in options.accent_color &&
    "g" in options.accent_color &&
    "b" in options.accent_color
  ) {
    processed_color = (options.accent_color.r << 16) | (options.accent_color.g << 8) | options.accent_color.b
  }

  return {
    type        : component_type.container,
    components  : options.components,
    accent_color: processed_color as number | null | undefined,
    spoiler     : options.spoiler,
  }
}

export function build_message(options: {
  components: (container_component | text_component)[]
  content?: string
}): message_payload {
  return {
    flags: 32768,
    content: options.content,
    components: options.components,
  }
}

export function emoji_object(name: string, id?: string): { id?: string; name: string } {
  return id ? { id, name } : { name }
}

export interface gallery_item {
  media: { url: string }
  description?: string
  spoiler?: boolean
}

export interface media_gallery_component {
  type: number
  items: gallery_item[]
}

export function media_gallery(items: gallery_item[]): media_gallery_component {
  return {
    type: component_type.media_gallery,
    items,
  }
}

export function gallery_item(url: string, description?: string, spoiler?: boolean): gallery_item {
  return {
    media: { url },
    description,
    spoiler,
  }
}

export function from_hex(hex: string): number {
  const cleaned = hex.replace(/^#/, "")
  return parseInt(cleaned, 16)
}

export interface file_component {
  type: number
  file: { url: string }
}

export function file(url: string): file_component {
  return {
    type: component_type.file,
    file: { url },
  }
}

/**
 * @param {string | string[]} content - Message content
 * @param {string} image_url - Optional image URL
 * @param {boolean} is_interaction - Whether this is an interaction reply (adds ephemeral + component flags)
 * @returns {message_payload} Component v2 payload
 */
export function build_component_reply(
  content: string | string[],
  image_url?: string,
  is_interaction: boolean = false
): message_payload {
  const components_array: (section_component | text_component)[] = []

  if (image_url && image_url.trim().length > 0) {
    components_array.push(section({ content, media: image_url }))
  } else {
    components_array.push(text(content))
  }

  return {
    flags      : is_interaction ? 32832 : 32768,
    components : [container({ components: components_array })],
  }
}
