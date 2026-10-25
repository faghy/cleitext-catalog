/**
 * The parts of the dynamic CSS, in the order they are added. Each is ported
 * from the same-named function of the reference and checked against it.
 * (Generated: the order and the wiring of the modules.)
 */
import type { Ctx } from '../../core/context.js';
import type { Options } from '../../core/options.js';
import { part as oldHeaderCustomMenuCss } from './old_header_custom_menu_css.js';
import { part as iconsStaticCss } from './icons_static_css.js';
import { part as loadModernBlockEditorUi } from './load_modern_block_editor_ui.js';
import { part as inlineOnMobileCss } from './inline_on_mobile_css.js';
import { part as generateGlobalPaletteStyle } from './generate_global_palette_style.js';
import { part as paletteGlobalBorderCompatibility } from './palette_global_border_compatibility.js';
import { part as postSingleStructure } from './post_single_structure.js';
import { part as postArchiveStructure } from './post_archive_structure.js';
import { part as specialArchive } from './special_archive.js';
import { part as extTransparentHeader } from './ext_transparent_header.js';
import { part as extTransparentAboveHeaderSections } from './ext_transparent_above_header_sections.js';
import { part as extTransparentBelowHeaderSections } from './ext_transparent_below_header_sections.js';
import { part as breadcrumbSection } from './breadcrumb_section.js';
import { part as headingColorsSection } from './heading_colors_section.js';
import { part as builderFooter } from './builder_footer.js';
import { part as builderMobileHeaderLogoCss } from './builder_mobile_header_logo_css.js';
import { part as hbSiteIdentity } from './hb_site_identity.js';
import { part as hbButton } from './hb_button.js';
import { part as hbMenu } from './hb_menu.js';
import { part as hbHtml } from './hb_html.js';
import { part as hbSearch } from './hb_search.js';
import { part as hbAccount } from './hb_account.js';
import { part as hbSocialIcon } from './hb_social_icon.js';
import { part as hbWidget } from './hb_widget.js';
import { part as fbBelowFooter } from './fb_below_footer.js';
import { part as fbHtml } from './fb_html.js';
import { part as fbButton } from './fb_button.js';
import { part as fbCopyright } from './fb_copyright.js';
import { part as fbSocialIcon } from './fb_social_icon.js';
import { part as fbAboveFooter } from './fb_above_footer.js';
import { part as fbPrimaryFooter } from './fb_primary_footer.js';
import { part as fbWidget } from './fb_widget.js';
import { part as returnOutput } from './return_output.js';
import { part as returnMetaOutput } from './return_meta_output.js';
import { part as contentBackgroundCss } from './content_background_css.js';
import { part as darkPaletteCss } from './dark_palette_css.js';
import { part as relatedPostsStaticCss } from './related_posts_static_css.js';
import { part as relatedPostsCss } from './related_posts_css.js';
import { part as scrollToTopStaticCss } from './scroll_to_top_static_css.js';
import { part as scrollToTop } from './scroll_to_top.js';
import { part as offCanvasRowSetting } from './off_canvas_row_setting.js';
import { part as primaryHeaderBreakpointStyle } from './primary_header_breakpoint_style.js';
import { part as mobileTriggerRowSetting } from './mobile_trigger_row_setting.js';
import { part as hbMobileMenu } from './hb_mobile_menu.js';
import { part as aboveHeaderRowSetting } from './above_header_row_setting.js';
import { part as belowHeaderRowSetting } from './below_header_row_setting.js';
import { part as hbFooterMenu } from './hb_footer_menu.js';
import { part as commentsCss } from './comments_css.js';
import { part as singlePostCss } from './single_post_css.js';
import { part as paginationCss } from './pagination_css.js';
import { part as navigationCss } from './navigation_css.js';
import { part as logoSvgIcons } from './logo_svg_icons.js';
import { part as languageSwitcher } from './language_switcher.js';

export interface Part {
  /** The function of the reference it reproduces. */
  name: string;
  /** Its rules go before the ones added so far. */
  prepend?: boolean;
  /** All its rules (compared with the reference function alone). */
  run(o: Options, c: Ctx): string;
  /** When set: rules put at the very start of the page CSS, and `rest` where the part is. */
  lead?(o: Options, c: Ctx): string;
  rest?(o: Options, c: Ctx): string;
}

const todo = (name: string, prepend = false): Part => ({ name, prepend, run: () => '' });

export const PARTS: Part[] = [
  oldHeaderCustomMenuCss,
  iconsStaticCss,
  loadModernBlockEditorUi,
  inlineOnMobileCss,
  generateGlobalPaletteStyle,
  paletteGlobalBorderCompatibility,
  postSingleStructure,
  postArchiveStructure,
  specialArchive,
  extTransparentHeader,
  extTransparentAboveHeaderSections,
  extTransparentBelowHeaderSections,
  breadcrumbSection,
  headingColorsSection,
  builderFooter,
  builderMobileHeaderLogoCss,
  hbSiteIdentity,
  hbButton,
  hbMenu,
  hbHtml,
  hbSearch,
  hbAccount,
  hbSocialIcon,
  hbWidget,
  fbBelowFooter,
  fbHtml,
  fbButton,
  fbCopyright,
  fbSocialIcon,
  fbAboveFooter,
  fbPrimaryFooter,
  fbWidget,
  returnOutput,
  returnMetaOutput,
  contentBackgroundCss,
  darkPaletteCss,
  relatedPostsStaticCss,
  relatedPostsCss,
  scrollToTopStaticCss,
  scrollToTop,
  offCanvasRowSetting,
  primaryHeaderBreakpointStyle,
  mobileTriggerRowSetting,
  hbMobileMenu,
  aboveHeaderRowSetting,
  belowHeaderRowSetting,
  hbFooterMenu,
  commentsCss,
  singlePostCss,
  paginationCss,
  navigationCss,
  logoSvgIcons,
  languageSwitcher,
];
