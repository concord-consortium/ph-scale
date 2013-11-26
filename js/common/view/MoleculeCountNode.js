// Copyright 2002-2013, University of Colorado Boulder

/**
 * Displays the number of molecules in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var H2OMoleculeNode = require( 'PH_SCALE/common/view/H2OMoleculeNode' );
  var H3OMoleculeNode = require( 'PH_SCALE/common/view/H3OMoleculeNode' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OHMoleculeNode = require( 'PH_SCALE/common/view/OHMoleculeNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var FONT = new PhetFont( 22 );

  /*
   * Converts a number to a format like 1.23 x 10^25
   * @param {Number} value the number to be formatted
   * @param {Number} precision how many digits in the mantissa
   * @return {String} HTML fragment
   */
  var toTimesTenString = function( value, precision ) {
    if ( value === 0 ) {
      return '0';
    }
    else {
      var precisionString = value.toPrecision( precision ); // eg, 12345 -> 1.23e+4
      var tokens = precisionString.split( 'e+' );
      if ( tokens.length === 1 ) {
        return tokens[0]; // no exponent, return the mantissa
      }
      else {
        return tokens[0] + ' x 10<sup>' + tokens[1] + '</sup>'; // mantissa x 10^exponent
      }
    }
  };

  /**
   * @param {Solution} solution
   * @constructor
   */
  function MoleculeCountNode( solution ) {

    var thisNode = this;
    Node.call( thisNode );

    // molecule icons
    var nodeH3O = new H3OMoleculeNode();
    var nodeOH = new OHMoleculeNode();
    var nodeH2O = new H2OMoleculeNode();
    var maxMoleculeWidth = Math.max( nodeH3O.width, Math.max( nodeOH.width, nodeH2O.width ) );
    var maxMoleculeHeight = Math.max( nodeH3O.height, Math.max( nodeOH.height, nodeH2O.height ) );

    // count values
    var countH3O = new HTMLText( '0.00 x 10<sup>00</sup>', { font: FONT, fill: 'white' } );
    var countOH = new HTMLText( '0.00 x 10<sup>00</sup>', { font: FONT, fill: 'white' } );
    var countH2O = new HTMLText( '0.00 x 10<sup>00</sup>', { font: FONT, fill: 'black' } );
    var maxCountWidth = countH3O.width;
    var maxCountHeight = countH3O.height;

    // backgrounds
    var xMargin = 10;
    var yMargin = 5;
    var xSpacing = 5;
    var backgroundWidth = maxCountWidth + xSpacing + maxMoleculeWidth + ( 2 * xMargin );
    var backgroundHeight = Math.max( maxCountHeight, maxMoleculeHeight ) + ( 2 * yMargin );
    var cornerRadius = 5;
    var backgroundH3O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: PHScaleColors.ACIDIC, stroke: PHScaleColors.ACIDIC.darkerColor() } );
    var backgroundOH = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: PHScaleColors.BASIC, stroke: PHScaleColors.BASIC.darkerColor() } );
    var backgroundH2O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: PHScaleColors.WATER, stroke: PHScaleColors.WATER.darkerColor() } );

    // rendering order
    thisNode.addChild( backgroundH3O );
    thisNode.addChild( backgroundOH );
    thisNode.addChild( backgroundH2O );
    thisNode.addChild( countH3O );
    thisNode.addChild( countOH );
    thisNode.addChild( countH2O );
    thisNode.addChild( nodeH3O );
    thisNode.addChild( nodeOH );
    thisNode.addChild( nodeH2O );

    // layout
    var ySpacing = 6;
    backgroundOH.left = backgroundH3O.left;
    backgroundOH.top = backgroundH3O.bottom + ySpacing;
    backgroundH2O.left = backgroundOH.left;
    backgroundH2O.top = backgroundOH.bottom + ySpacing;
    nodeH3O.right = backgroundH3O.right - xMargin;
    nodeH3O.centerY = backgroundH3O.centerY;
    nodeOH.right = backgroundOH.right - xMargin;
    nodeOH.centerY = backgroundOH.centerY;
    nodeH2O.right = backgroundH2O.right - xMargin;
    nodeH2O.centerY = backgroundH2O.centerY;
    countH3O.centerY = backgroundH3O.centerY;
    countOH.centerY = backgroundOH.centerY;
    countH2O.centerY = backgroundH2O.centerY;

    // update counts when the solution changes
    var moleculesLeft = Math.min( nodeH3O.left, Math.min( nodeOH.left, nodeH2O.left ) ); // for right justifying counts
    var updateCounts = function() {
      // format and set values
      countH3O.text = toTimesTenString( solution.getMoleculesH3O(), 3 );
      countOH.text = toTimesTenString( solution.getMoleculesOH(), 3 );
      countH2O.text = toTimesTenString( solution.getMoleculesH2O(), 2 );
      // right justify
      countH3O.right = moleculesLeft - xSpacing;
      countOH.right = moleculesLeft - xSpacing;
      countH2O.right = moleculesLeft - xSpacing;
    };
    solution.pHProperty.link( updateCounts );
    solution.solventVolumeProperty.link( updateCounts );
    solution.soluteVolumeProperty.link( updateCounts );
  }

  return inherit( Node, MoleculeCountNode );
} );
