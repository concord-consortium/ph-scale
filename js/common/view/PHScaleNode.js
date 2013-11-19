// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH scale used in meters, with sliding vertical indicator.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var acidicString = require( 'string!PH_SCALE/acidic' );
  var basicString = require( 'string!PH_SCALE/basic' );
  var neutralString = require( 'string!PH_SCALE/neutral' );
  var pattern_pH_0value = require( 'string!PH_SCALE/pattern.ph.0value' );

  // constants
  var SCALE_LABEL_FONT = new PhetFont( 30 );
  var TICK_LENGTH = 15;
  var TICK_FONT = new PhetFont( 22 );
  var NEUTRAL_TICK_LENGTH = 40;
  var TICK_LABEL_X_SPACING = 5;
  var INDICATOR_ARROW_SIZE = new Dimension2( 21, 28 );

  /**
   * pH indicator that slides vertically along scale.
   * When there is no pH value, it points to 'neutral' but does not display a value.
   * @param {Property<Number>} pHProperty
   * @constructor
   */
  function IndicatorNode( pHProperty, scaleWidth ) {

    var thisNode = this;
    Node.call( thisNode );

    var lineNode = new Line( 0, 0, scaleWidth, 0, {
      stroke: 'black',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );
    thisNode.addChild( lineNode );

    var arrowNode = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( -INDICATOR_ARROW_SIZE.width, -INDICATOR_ARROW_SIZE.height / 2 )
      .lineTo( -INDICATOR_ARROW_SIZE.width, INDICATOR_ARROW_SIZE.height / 2 )
      .close(), {
      fill: 'black'
    } );
    arrowNode.right = lineNode.left - 5;
    thisNode.addChild( arrowNode );

    var pHValueNode = new Text( '0', { font: new PhetFont( 28 ) } );
    thisNode.addChild( pHValueNode );

    pHProperty.link( function( value ) {
      // value
      pHValueNode.text = value ? StringUtils.format( pattern_pH_0value, ( Util.toFixed( value, PHScaleConstants.PH_METER_DECIMAL_PLACES ) ) ) : "";
      pHValueNode.right = arrowNode.left - 3;
      pHValueNode.centerY = arrowNode.centerY;
      pHValueNode.centerY = arrowNode.centerY;
      // gray out the arrow?
      arrowNode.fill = ( value ? 'black' : 'rgba(0,0,0,0.3)' );
      // hide the line?
      lineNode.visible = ( value ? true : false );
    } );
  }

  inherit( Node, IndicatorNode );

  /**
   * The body of the meter includes the Acidic-Basic vertical scale,
   * and the indicator that points to a value on the scale.
   * @param {Property<Number>} pHProperty
   * @param {Dimension2} size
   * @constructor
   */
  function PHScaleNode( pHProperty, size ) {

    var thisNode = this;
    Node.call( this );

    // gradient background
    var backgroundNode = new Rectangle( 0, 0, size.width, size.height, {
      fill: new LinearGradient( 0, 0, 0, size.height )
        .addColorStop( 0, PHScaleColors.OH )
        .addColorStop( 1, PHScaleColors.H3O ),
      stroke: 'black',
      lineWidth: 2
    } );
    thisNode.addChild( backgroundNode );

    // 'Acidic' label
    var textOptions = { fill: 'white', font: SCALE_LABEL_FONT };
    var acidicNode = new Text( acidicString, textOptions );
    acidicNode.rotation = -Math.PI / 2;
    acidicNode.centerX = backgroundNode.centerX;
    acidicNode.centerY = 0.75 * backgroundNode.height;
    thisNode.addChild( acidicNode );

    // 'Basic' label
    var basicNode = new Text( basicString, textOptions );
    basicNode.rotation = -Math.PI / 2;
    basicNode.centerX = backgroundNode.centerX;
    basicNode.centerY = 0.25 * backgroundNode.height;
    thisNode.addChild( basicNode );

    // tick marks, labeled at 'even' values, skip 7 (neutral)
    var y = size.height;
    var dy = -size.height / PHScaleConstants.PH_RANGE.getLength();
    for ( var pH = PHScaleConstants.PH_RANGE.min; pH <= PHScaleConstants.PH_RANGE.max; pH++ ) {
      if ( pH !== 7 ) {
        // tick mark
        var lineNode = new Line( 0, 0, TICK_LENGTH, 0, { stroke: 'black', lineWidth: 1 } );
        lineNode.left = backgroundNode.right;
        lineNode.centerY = y;
        thisNode.addChild( lineNode );

        // tick label
        if ( pH % 2 === 0 ) {
          var tickLabelNode = new Text( pH, { font: TICK_FONT } );
          tickLabelNode.left = lineNode.right + TICK_LABEL_X_SPACING;
          tickLabelNode.centerY = lineNode.centerY;
          thisNode.addChild( tickLabelNode );
        }
      }
      y += dy;
    }

    // 'Neutral' line
    var neutralLineNode = new Line( 0, 0, NEUTRAL_TICK_LENGTH, 0, { stroke: 'black', lineWidth: 1 } );
    neutralLineNode.left = backgroundNode.right;
    neutralLineNode.centerY = size.height / 2;
    thisNode.addChild( neutralLineNode );
    var neutralLabelNode = new Text( neutralString, { font: TICK_FONT } );
    neutralLabelNode.left = neutralLineNode.right + TICK_LABEL_X_SPACING;
    neutralLabelNode.centerY = neutralLineNode.centerY;
    thisNode.addChild( neutralLabelNode );

    // indicator
    var indicatorNode = new IndicatorNode( pHProperty, size.width );
    indicatorNode.right = backgroundNode.right;
    thisNode.addChild( indicatorNode );

    // move the indicator to point to the proper value on the scale
    pHProperty.link( function( value ) {
      indicatorNode.centerY = Util.linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, size.height, 0, value || 7 );
    } );
  }

  return inherit( Node, PHScaleNode );
} );
