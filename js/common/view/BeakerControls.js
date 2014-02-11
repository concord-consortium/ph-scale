// Copyright 2002-2013, University of Colorado Boulder

/**
 * Controls what you see in the beaker.
 * This includes the ''H3O+/OH- ratio' and 'Molecule count' representations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var CheckBox = require( 'SUN/CheckBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var SubSupText = require( 'PH_SCALE/common/view/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var moleculeCountString = require( 'string!PH_SCALE/moleculeCount' );
  var ratioString = require( 'string!PH_SCALE/ratio' );

  // constants
  var FONT = new PhetFont( 20 );

  /**
   * @param {Property<Boolean>} ratioVisibleProperty
   * @param {Property<Boolean>} moleculeCountVisibleProperty
   * @constructor
   */
  function BeakerControls( ratioVisibleProperty, moleculeCountVisibleProperty ) {

    // 'H3O+/OH- ratio' check box, with color-coded label
    var stringH3O = '<span style="color:' + PHScaleColors.ACIDIC.toCSS() + '">H<sub>3</sub>O<sup>+</sup></span>';
    var stringOH = '<span style="color:' + PHScaleColors.BASIC.toCSS() + '">OH<sup>-</sup></span>';
    var ratioLabel = new SubSupText( StringUtils.format( ratioString, stringH3O, stringOH ), { font: FONT } );
    var ratioCheckBox = new CheckBox( ratioLabel, ratioVisibleProperty );
    ratioCheckBox.touchArea = Shape.bounds( ratioCheckBox.localBounds.dilatedXY( 10, 8 ) );

    // 'Molecule count' check box
    var moleculeCountLabel = new Text( moleculeCountString, { font: FONT } );
    var moleculeCountCheckBox = new CheckBox( moleculeCountLabel, moleculeCountVisibleProperty );
    moleculeCountCheckBox.touchArea = Shape.bounds( ratioCheckBox.localBounds.dilatedXY( 10, 8 ) );

    var separator = new Line( 0, 0, Math.max( moleculeCountCheckBox.width, ratioCheckBox.width ), 0, { stroke: 'gray' } );

    var children = [ ratioCheckBox, separator, moleculeCountCheckBox ];
    if ( !window.phetcommon.getQueryParameter( 'dev' ) ) {
      children = [ moleculeCountCheckBox ]; //TODO temporarily hide the ratio feature until it's usable
    }

    var content = new VBox( {
      children: children,
      align: 'left',
      spacing: 10
    } );

    Panel.call( this, content, {
      xMargin: 15,
      yMargin: 10,
      lineWidth: 2,
      fill: PHScaleColors.PANEL_FILL
    } );
  }

  return inherit( Panel, BeakerControls );
} );
