pragma solidity 0.5.16;

import "./ERC721Full.sol";

contract Color is ERC721Full {
  string[] public colors;
  mapping(string => bool) _colorExists;

  constructor() ERC721Full("Color", "COLOR") public {
  }

  // E.G. color = "#FFFFFF"
  function mint(string memory _color) public {

    // require unique color
    require(!_colorExists[_color]);
    // Color - add it
    uint _id = colors.push(_color); 
    // Call the mint function    
    _mint(msg.sender, _id);
    // Color - track it
    _colorExists[_color] = true;
  }

}
