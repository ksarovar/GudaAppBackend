const mongoose = require('mongoose');

const cssSchema = new mongoose.Schema({
    color: { type: String, required: true },
    backgroundColor: { type: String },
    backgroundImage: { type: String },
    backgroundSize: { type: String },
    backgroundRepeat: { type: String },
    backgroundPosition: { type: String },
    
    fontSize: { type: String, required: true },
    fontFamily: { type: String },
    fontWeight: { type: String },
    fontStyle: { type: String },
    lineHeight: { type: String },
    letterSpacing: { type: String },
    textDecoration: { type: String },
    textTransform: { type: String },

    margin: { type: String },
    padding: { type: String },
    
    border: { type: String },
    borderWidth: { type: String },
    borderColor: { type: String },
    borderStyle: { type: String },
    borderRadius: { type: String },
    boxShadow: { type: String },

    display: { type: String },
    position: { type: String },
    top: { type: String },
    right: { type: String },
    bottom: { type: String },
    left: { type: String },
    zIndex: { type: Number },
    overflow: { type: String },
    width: { type: String },
    height: { type: String },
    minWidth: { type: String },
    minHeight: { type: String },
    maxWidth: { type: String },
    maxHeight: { type: String },
    float: { type: String },
    clear: { type: String },

    flex: { type: String },
    flexDirection: { type: String },
    flexWrap: { type: String },
    justifyContent: { type: String },
    alignItems: { type: String },
    alignSelf: { type: String },

    gridTemplateColumns: { type: String },
    gridTemplateRows: { type: String },
    gridArea: { type: String },
    gridColumn: { type: String },
    gridRow: { type: String },

    opacity: { type: Number },
    cursor: { type: String },
    transition: { type: String },
    transform: { type: String },
    overflowX: { type: String },
    overflowY: { type: String },
    visibility: { type: String },
    whiteSpace: { type: String },
    wordWrap: { type: String },
    boxSizing: { type: String },

    responsive: { type: Map, of: String } // Allows for responsive styles
});

module.exports = mongoose.model('Css', cssSchema);
