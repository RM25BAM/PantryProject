'use client'
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import inputBox from './globals.css';
import Fuse from 'fuse.js';
import { Box, Stack, Typography, Button, Modal, TextField, GlobalStyles, IconButton } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'white',
  width: 400,
  height: 400,
  border: '20%px solid #000',
  boxShadow: 24,
  padding: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);

    const fuseInstance = new Fuse(inventoryList, {
      keys: ['name', 'title', 'description'],
    });
    setFuse(fuseInstance);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const addQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updateInventory();
  };

  const subQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = searchTerm && fuse
    ? fuse.search(searchTerm).map(result => result.item)
    : inventory; 
// this is a single line if else statement
  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box border={'contained'}>
        <Box
          borderRadius={3}
          width="1300px"
          height="80px"
          bgcolor={'#f0f0f0'}
          display={'flex'}
          justifyContent={'right'}
          alignItems={'center'}
        >
          <Box justifyContent={'right'} marginRight={65} className="text-color">
            <h1> 
              Pantry Tracker
            </h1>
          </Box>
          <Box justifyContent={'left'} marginRight={2}>
          <Button variant="contained" onClick={handleOpen} className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
            Add New Item
          </Button>
          </Box>
        <Box justifyContent={'left'} marginRight={2}>
        <input
          type="text"
          className="inputBox"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Box>
      </Box>
        <Stack width="1300px" height="600px" spacing={2} overflow={'auto'} marginTop={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
              borderRadius={3}
              
            >
              <Typography variant={'h5'} color={'#333'} textAlign={'right'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h6'} color={'#333'} textAlign={'right'}>
                Quantity: {quantity}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                  onClick={() => addQuantity(name)}
                  color="primary"
                  aria-label="add"
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  onClick={() => subQuantity(name)}
                  color="primary"
                  aria-label="subtract"
                  disabled={quantity === 0}
                >
                  <RemoveIcon />
                </IconButton>

              <IconButton
                  onClick={() => removeItem(name)}
                  color="secondary"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
                </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
};
