<?php
/**
 * Plugin Name:       Woodoo Post Meta
 * Description:       Displays the custom meta fields for a post
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       woodoo-post-meta
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

function render_woodoo_post_meta() {
  $id = get_the_ID();
  $meta = get_metadata( 'post', $id );
  $externalLink = $meta['site_externe'][0];
  $video = $meta['file_video'][0];
  $content = '';
  if ( $externalLink != '' ) {
    $link = $meta['site_externe'][0];
    $content = '<div class="external-link-container"><a href="'.$link.'" class="external-link"><span class="external-link-words">Go to link</span><span class="external-link-arrow"> -> </span></a></div>';
  }
  if ( isset( $meta['filepdf'][0]) && $meta['filepdf'][0] != '' ) {
    $attachment = wp_get_attachment_url( $meta['filepdf'][0] );
    $content = $content.'<div class="external-link-container"><a href="'.$attachment.'" class="external-link"><span class="external-link-words">Read more</span><span class="external-link-arrow"> -> </span></a></div>';
  }
  if ( $video != '' ) {
    $content = $content.'<div class="external-link-container"><a href="'.$video.'" class="external-link"><span class="external-link-words">Watch</span><span class="external-link-arrow"> -> </span></a></div>';
  }
  return $content;
}
function create_block_woodoo_post_meta_block_init() {
  register_block_type( __DIR__ . '/build', array(
    'render_callback' => 'render_woodoo_post_meta',
  ) );
}
add_action( 'init', 'create_block_woodoo_post_meta_block_init' );

// register custom meta tag field
function register_post_meta_posts() {
  register_post_meta( 'post', 'site_externe', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string'
  ) );
  register_post_meta( 'post', 'file_video', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string'
  ) );
  register_post_meta( 'post', 'filepdf', array(
      'show_in_rest' => true,
      'single' => true,
      'type' => 'string'
  ) );
}
add_action( 'init', 'register_post_meta_posts' );