import React, { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, Input, Button, Text, useToast, Image, Grid, GridItem } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [hexCode, setHexCode] = useState("");
  const [colorName, setColorName] = useState("");
  const [colorSwatch, setColorSwatch] = useState(null);
  const [exampleColors, setExampleColors] = useState([]);
  const toast = useToast();

  const fetchColorInfo = async (hex) => {
    try {
      const response = await fetch(`https://api.color.pizza/v1/${hex}`);
      if (!response.ok) {
        throw new Error("Color not found");
      }
      const data = await response.json();
      if (data.colors && data.colors.length > 0) {
        setColorName(data.colors[0].name);
        setColorSwatch(data.colors[0].swatchImg.svg);
      } else {
        setColorName("Color name not found");
        setColorSwatch(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
    Promise.all(colors.map(fetchColorInfo)).then(setExampleColors);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchColorInfo(hexCode.replace("#", ""));
  };

  return (
    <Box p={4}>
      <FormControl id="hex-color" as="form" onSubmit={handleSubmit}>
        <FormLabel>Enter HEX Color Code</FormLabel>
        <Input type="text" placeholder="e.g., #1a2b3c" value={hexCode} onChange={(e) => setHexCode(e.target.value)} />
        <Button leftIcon={<FaSearch />} mt={2} colorScheme="blue" type="submit">
          Translate Color
        </Button>
      </FormControl>
      {exampleColors.length > 0 && (
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">Example Colors</Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {exampleColors.map(color => (
              <GridItem key={color.hex}>
                <Box borderWidth={1} borderRadius="lg" overflow="hidden">
                  <Box p={2} dangerouslySetInnerHTML={{ __html: color.swatchImg.svg }} />
                  <Box p={2}>
                    <Text>{color.name}</Text>
                    <Text>{color.hex}</Text>
                  </Box>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Box>
      )}
      
      {colorName && (
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">
            Color Name: {colorName}
          </Text>
          {colorSwatch && <Box mt={2} dangerouslySetInnerHTML={{ __html: colorSwatch }} />}
        </Box>
      )}
    </Box>
  );
};

export default Index;
