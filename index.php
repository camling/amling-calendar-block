<?php

/**
 * Plugin Name: Amling Calendar Plugin
 * Author: Chris Amling
 * Version: 1.1.0
 * Description: This is a plugin that interacts with the Evanced Calendar system. It creates a custom block named Calendar Details that displays event information based on the event id passed to it.
 */

function adding_amling_block_category( $categories ) {
    return array_merge(
        $categories,
        [
            [
                'slug'  => 'amling-blocks',
                'title' => __( 'amling Blocks', 'amling-boilerplate' ),
            ],
        ]
    );
}
add_action( 'block_categories', 'adding_amling_block_category', 10, 2 );


 function load_block_files(){
    $script_params = array(
        'library_id' => get_option('calendar_block_options_option_name')
    );

     wp_enqueue_script(
         'amling-plugin-unique-handle', // unique handle name
         plugin_dir_url(__FILE__) . 'amling-calendar-block.js', // source of JS
         array('wp-blocks', 'wp-i18n', 'wp-editor'), // the other scripts this relies on
         1.1,
         true
     );
 }

 add_action('enqueue_block_editor_assets', 'load_block_files');


 class CalendarBlockOptions {
	private $calendar_block_options_options;

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'calendar_block_options_add_plugin_page' ) );
		add_action( 'admin_init', array( $this, 'calendar_block_options_page_init' ) );
	}

	public function calendar_block_options_add_plugin_page() {
		add_menu_page(
			'Calendar Block Options', // page_title
			'Calendar Block Options', // menu_title
			'manage_options', // capability
			'calendar-block-options', // menu_slug
			array( $this, 'calendar_block_options_create_admin_page' ), // function
			'dashicons-admin-generic', // icon_url
			65 // position
		);
	}

	public function calendar_block_options_create_admin_page() {
		$this->calendar_block_options_options = get_option( 'calendar_block_options_option_name' ); ?>

		<div class="wrap">
			<h2>Calendar Block Options</h2>
			<p></p>
			<?php settings_errors(); ?>

			<form method="post" action="options.php">
				<?php
					settings_fields( 'calendar_block_options_option_group' );
					do_settings_sections( 'calendar-block-options-admin' );
					submit_button();
				?>
			</form>
		</div>
	<?php }

	public function calendar_block_options_page_init() {
		register_setting(
			'calendar_block_options_option_group', // option_group
			'calendar_block_options_option_name', // option_name
			array( $this, 'calendar_block_options_sanitize' ) // sanitize_callback
		);

		add_settings_section(
			'calendar_block_options_setting_section', // id
			'Settings', // title
			array( $this, 'calendar_block_options_section_info' ), // callback
			'calendar-block-options-admin' // page
		);

		add_settings_field(
			'library_id_0', // id
			'Library ID', // title
			array( $this, 'library_id_0_callback' ), // callback
			'calendar-block-options-admin', // page
			'calendar_block_options_setting_section' // section
		);
	}

	public function calendar_block_options_sanitize($input) {
		$sanitary_values = array();
		if ( isset( $input['library_id_0'] ) ) {
			$sanitary_values['library_id_0'] = sanitize_text_field( $input['library_id_0'] );
		}

		return $sanitary_values;
	}

	public function calendar_block_options_section_info() {
		
	}

	public function library_id_0_callback() {
		printf(
			'<input class="regular-text" type="text" name="calendar_block_options_option_name[library_id_0]" id="library_id_0" value="%s">',
			isset( $this->calendar_block_options_options['library_id_0'] ) ? esc_attr( $this->calendar_block_options_options['library_id_0']) : ''
		);
	}

}
if ( is_admin() )
	$calendar_block_options = new CalendarBlockOptions();


?>