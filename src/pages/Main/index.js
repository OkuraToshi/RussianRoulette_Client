import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button as MuiButton, ButtonGroup, Grid, Stack, Typography, styled } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import DiamondIcon from '@mui/icons-material/Diamond';
import LeftSlider from './LeftSlider';
import RightSlider from './RightSlider';
import BetListModal from '../../components/BetListModal';
import GameInfoModal from '../../components/GameInfoModal';
import BetInfoModal from '../../components/BetInfoModal';
import useBetList from '../../hooks/useBetList';
import useGameInfo from '../../hooks/useGameInfo';
import useAuth from '../../hooks/useAuth';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import PercentIcon from '@mui/icons-material/Percent';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import CloseIcon from '@mui/icons-material/Close';
import GunAnimation from './GunAnimation';
import './style.css';
import { STATES } from 'mongoose';
import { addNewGame } from '../../redux/slices/game';
import { useDispatch, useSelector } from '../../redux/store';
import Marquee from "react-easy-marquee";

const betPercentagesData = [
  { bgColor: 'bg-green', value: 14.52 },
  { bgColor: 'bg-yellow', value: 71.39 },
  { bgColor: 'bg-purple', value: 44.86 },
  { bgColor: 'bg-white', value: 59.87 },
  { bgColor: 'bg-green', value: 13.52 },
];

const bottomBetPercentages = [
  { bgColor: 'bg-blue', value: 25.55 },
  { bgColor: 'bg-white', value: 49.97 },
  { bgColor: 'bg-yellow', value: 3.5 },
  { bgColor: 'bg-green', value: 16.35 },
  { bgColor: 'bg-yellow', value: 43.05 },
  { bgColor: 'bg-green', value: 11.74 },
  { bgColor: 'bg-yellow', value: 6.4 },
  { bgColor: 'bg-white', value: 79.72 },
  { bgColor: 'bg-green', value: 45.5 },
  { bgColor: 'bg-yellow', value: 72.83 }
];

const MainButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#f8bf60',
  boxShadow: '0 6px 0 #997a49',
  '&:hover': {
    backgroundColor: '#ab884d',
    boxShadow: '0 6px 0 #725c38',
    border: 'none'
  },
  border: 'none'
}));
const BlackButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#171c22',
  '&:hover': {
    backgroundColor: '#000000',
  }
}));

export default function Main(props) {
  const { currentUser } = useAuth();
  const [speed, setSpeed] = useState(0);
  const dispatch = useDispatch();
  const { result, randomNumbers } = useSelector((state) => state.game)
  const [autoplay, setAutoplay] = useState(false);
  const [advancedAutoplay, setAdvancedAutoplay] = useState(false);
  const { openBetListModal } = useBetList();
  const { openGameInfoModal } = useGameInfo();
  const [isStart, setIsStart] = useState(false);
  const [startRandomGenerate, setStartRandomGenerate] = useState(false);
  const [betPercentages, setBetPercentages] = useState([
    { bgColor: 'bg-green', value: 14.52 },
    { bgColor: 'bg-yellow', value: 71.39 },
    { bgColor: 'bg-purple', value: 44.86 },
    { bgColor: 'bg-white', value: 59.87 },
  ])

  const [wagered, setWagered] = useState(0);
  const [payout, setPayout] = useState(0);

  const openhandleAutoplay = () => {
    setAutoplay(true);
  }
  const closehandleAutoplay = () => {
    setAutoplay(false);
    setAdvancedAutoplay(false);
  }
  const openAdvancedAutoplay = () => {
    setAdvancedAutoplay(true);
    setAutoplay(false);
  }
  const closeAdvancedAutoplay = () => {
    setAdvancedAutoplay(false);
    setAutoplay(true);
  }
  const animationStart = () => {
    setIsStart(true)
    setStartRandomGenerate(true)
  }

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Number((Math.random() * (max - min + 1) + min).toFixed(2));
  }

  const insertValueToColorBlock = (index, value) => {
    let _betPercentages = [...betPercentages];
    if (index >= betPercentages.length) {
      _betPercentages[index % betPercentages.length].value = value;
      setBetPercentages(_betPercentages);
    } else {
      _betPercentages[index].value = value;
      setBetPercentages(_betPercentages);
    }
  }

  const startGame = () => {
    setSpeed(3500);
    animationStart();
    if (currentUser) {
      dispatch(addNewGame(wagered, payout, currentUser.username, props.gameMode, props.gameType, currentUser._id));
    }
  }

  useEffect(() => {
    if (startRandomGenerate) {
      let i = 0;
      const interval = setInterval(() => {
        let randomNumber = getRandomInt(1, 100);
        insertValueToColorBlock(i, randomNumber);
        i += 1;
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startRandomGenerate])

  useEffect(() => {
    if (speed > 0) {
      setTimeout(() => setSpeed(0), 5700);
    }
  }, [speed])
  return (
    <Stack>
      <Stack spacing={0.5} justifyContent="space-between" sx={{ height: '82vh' }}>
        {/* Topbar percentages */}
        <Grid container columns={7} alignItems="center">
          <Grid item xs={7} md={1}>
            <Stack direction="row" justifyContent="center" className="bg-dark" height={55} borderRadius={1}>
              <Box
                component="img"
                src="/assets/images/logo.png"
                width='80%'
                height="auto"
                my="auto" />
            </Stack>
          </Grid>

          <Grid item xs={7} md={5}>
            <Box position="relative">
              <Box
                height={55}
                width={5}
                className="bg-dark"
                position="absolute"
                sx={{ right: '50%', zIndex: 1000, opacity: 0.5 }}
              />
              <Grid container columns={5} >
                <Marquee
                  duration={speed}
                // duration={0}
                // velocity={0}
                >
                  {
                    randomNumbers.map((percentageItem, index) => (
                      <Grid
                        item
                        key={index}
                        // md={1}
                        width="130px"
                        height={55}
                      >
                        <Stack borderRadius={1} className={betPercentagesData[(index + 1) % 4].bgColor} height={55} justifyContent="center" ml={0.5}>
                          <Typography
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              height: 'auto',
                              my: 'auto',
                              justifyContent: 'center',
                              fontFamily: 'Montserrat',
                            }}
                            fontSize={20}
                            fontWeight={700}
                            height={55}
                          >
                            x{percentageItem}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))
                  }
                </Marquee>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={7} md={1}>
            <Stack direction="row" justifyContent="center" className="bg-dark" height={55} borderRadius={1} ml={0.5}>
              <Box
                component="img"
                src="/assets/images/logo.png"
                width='80%'
                height="auto"
                my="auto" />
            </Stack>
          </Grid>
        </Grid>

        <Stack justifyContent="center" alignItems="center" className="bg-dark" borderRadius={1} sx={{ flexGrow: 1 }}>
          {/* <Box component="img" src="/assets/images/frame.png" width="50%" /> */}
          <GunAnimation isStart={isStart} setIsStart={setIsStart} />
        </Stack>

        <Stack sx={{ top: 'auto', bottom: 0 }} spacing={0.5}>
          <Box className="bg-dark" px={0.25} py={0.5} borderRadius={1}>
            <Grid container columns={10}>
              {
                bottomBetPercentages.map(percentageItem => (
                  <Grid item key={percentageItem.value} md={1}>
                    <Stack
                      borderRadius={1}
                      className={percentageItem.bgColor}
                      height={55}
                      justifyContent="center"
                      mx={0.25}
                    >
                      <Button onClick={openGameInfoModal}>
                        <Typography
                          sx={{ display: 'flex', alignItems: 'center', height: 'auto', my: 'auto', justifyContent: 'center' }}
                          fontSize={20}
                          fontWeight={700}
                          fontFamily="Montserrat"
                          color="#000000"
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />{percentageItem.value}
                        </Typography>
                      </Button>
                    </Stack>
                  </Grid>
                ))
              }
            </Grid>
          </Box>

          <Box width="100%">
            <Grid container columns={3} spacing={0.5}>
              <Grid item xs={3} md={1}>
                <LeftSlider wagered={wagered} setWagered={setWagered} />
              </Grid>

              <Grid item xs={3} md={1}>

                <Stack
                  position="relative"
                  className="bg-dark"
                  spacing={1.25}
                >
                  {
                    advancedAutoplay ?
                      <Stack
                        borderRadius="10px 10px 0px 0px"
                        backgroundColor="#f8bf60"
                        borderBottom="2px solid black"
                        sx={{ position: 'absolute', zIndex: 1000, bottom: 100, width: '100%' }}

                      >
                        <Box
                          sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}
                        >
                          <Box
                            margin={2}
                          >
                            <Typography
                              textTransform="uppercase"
                              fontSize={14}
                              fontWeight={700}
                            >
                              autoplay
                            </Typography>
                            <Typography
                              textTransform="uppercase"
                              fontSize={10}
                              fontWeight={700}
                            >
                              number of rounds
                            </Typography>
                          </Box>
                          <Box
                            backgroundColor="#000000"
                            borderRadius={2}
                            margin={2}
                            sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                          >
                            <Button
                              variant='text'
                            >
                              <Typography
                                textTransform="uppercase"
                                fontSize={14}
                                fontWeight={700}
                                padding={1}
                                pl={2}
                                onClick={closeAdvancedAutoplay}
                                color="#ffffff"
                              >
                                advanced
                              </Typography>
                              <KeyboardArrowDownIcon sx={{ color: '#ffffff' }} />
                            </Button>
                          </Box>
                        </Box>
                        <Box
                          textAlign="center"
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            ml={2}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            10
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            25
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            50
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            mr={2}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            75
                          </Typography>
                        </Box>
                        <Box
                          mt={1}
                          mb={2}
                          textAlign="center"
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            ml={2}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            100
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            500
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={900}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            backgroundColor="#000000"
                            borderRadius={2}
                            width="15%"
                          >
                            <AllInclusiveIcon sx={{ fontSize: 14, color: "#ffffff" }} />
                          </Typography>
                          <Typography
                            fontWeight={900}
                            padding={0.5}
                            fontSize={12}
                            pl={1}
                            pr={1}
                            mr={2}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                            textTransform="uppercase"
                          >
                            custom
                          </Typography>
                        </Box>
                        <Box
                          ml={2}
                        >
                          <Typography
                            fontSize={10}
                            fontWeight={900}
                            textTransform="uppercase"
                          >
                            total loss limit
                          </Typography>
                        </Box>
                        <Box
                          mt={2}
                          textAlign="center"
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            ml={2}
                            borderRadius={2}
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                          >
                            <AllInclusiveIcon sx={{ fontSize: 14 }} />
                          </Typography>
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            borderRadius={2}
                            fontSize={14}
                            padding={0.5}
                            fontWeight={700}
                          >
                            x5 BET
                          </Typography>
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            mr={2}
                            borderRadius={2}
                            fontSize={14}
                            padding={0.5}
                            fontWeight={700}
                          >
                            x20 BET
                          </Typography>
                        </Box>
                        <Box
                          mt={1}
                          textAlign="center"
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            ml={2}
                            borderRadius={2}
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                          >
                            x50 BET
                          </Typography>
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            borderRadius={2}
                            fontSize={14}
                            padding={0.5}
                            fontWeight={700}
                          >
                            x100 BET
                          </Typography>
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            mr={2}
                            borderRadius={2}
                            fontSize={14}
                            padding={0.5}
                            fontWeight={700}
                          >
                            CUSTOM
                          </Typography>
                        </Box>
                        <Box
                          ml={2}
                          mt={2}
                        >
                          <Typography
                            fontSize={10}
                            fontWeight={900}
                            textTransform="uppercase"
                          >
                            total profit limit
                          </Typography>
                        </Box>
                        <Box
                          mt={2}
                          textAlign="center"
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            ml={2}
                            borderRadius={2}
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                          >
                            <AllInclusiveIcon sx={{ fontSize: 14 }} />
                          </Typography>
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            borderRadius={2}
                            fontSize={14}
                            padding={0.5}
                            fontWeight={700}
                          >
                            x5 BET
                          </Typography>
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            mr={2}
                            borderRadius={2}
                            fontSize={14}
                            padding={0.5}
                            fontWeight={700}
                          >
                            x20 BET
                          </Typography>
                        </Box>
                        <Box
                          mt={1}
                          textAlign="center"
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            ml={2}
                            borderRadius={2}
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                          >
                            x50 BET
                          </Typography>
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            borderRadius={2}
                            fontSize={14}
                            padding={0.5}
                            fontWeight={700}
                          >
                            x100 BET
                          </Typography>
                          <Typography
                            backgroundColor="#ffffff"
                            width="25%"
                            mr={2}
                            borderRadius={2}
                            fontSize={14}
                            padding={0.5}
                            fontWeight={700}
                          >
                            CUSTOM
                          </Typography>
                        </Box>
                        <Box
                          m={2}
                        >
                          <Typography
                            fontSize={10}
                            fontWeight={900}
                            textTransform="uppercase"
                          >
                            stop when  bonus won
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'space-around' }}
                        >
                          <Typography
                            fontSize={16}
                            fontWeight={700}
                            ml={2}
                            textTransform="uppercase"
                            color="#ffffff"
                          >
                            off
                          </Typography>
                          <Box
                            width="70%"
                            sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Box
                              width="35%"
                              height="10px"
                              borderRadius={2}
                              backgroundColor="#ffffff"
                              pr={1}
                            >
                            </Box>
                            <Box
                              width="65%"
                              height="10px"
                              borderRadius={2}
                              backgroundColor="#000000"
                            >
                            </Box>
                          </Box>
                          <Typography
                            fontSize={16}
                            fontWeight={700}
                            mr={2}
                            textTransform="uppercase"
                            color="#000000"
                          >
                            on
                          </Typography>
                        </Box>
                        <Box
                          m={2}
                        >
                          <Typography
                            fontSize={10}
                            fontWeight={900}
                            textTransform="uppercase"
                          >
                            adjust bet on win
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={750}
                            pt={0.5}
                            pb={0.5}
                            ml={2}
                            textTransform="uppercase"
                            backgroundColor="#f8bf60"
                            border={1}
                            width="20%"
                            textAlign="center"
                            borderRadius="8px 0px 0px 8px"
                          >
                            reset
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={750}
                            p={0.5}
                            border={1}
                            borderColor="#000000"
                            textTransform="uppercase"
                            backgroundColor="#000000"
                            color="#ffffff"
                            width="25%"
                            textAlign="center"
                          >
                            increase
                          </Typography>
                          <Box
                            width="55%"
                            mr={2}
                            pt={0.5}
                            backgroundColor="#fcdfb0"
                            borderRadius="0px 8px 8px 0px"
                            border={1}
                            borderColor="#fcdfb0"
                            sx={{ display: 'flex', direction: 'row', justifyContent: 'center', alignItems: 'center' }}
                          >
                            <Typography
                              fontSize={16}
                              fontWeight={700}
                              width="90%"
                              textAlign="center"
                            >
                              75
                            </Typography>
                            <Typography
                              pr={0.5}
                            >
                              <PercentIcon sx={{ fontSize: 20 }} />
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          m={2}
                        >
                          <Typography
                            fontSize={10}
                            fontWeight={900}
                            textTransform="uppercase"
                          >
                            adjust bet on less
                          </Typography>
                        </Box>
                        <Box
                          mb={2}
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={750}
                            pt={0.5}
                            pb={0.5}
                            ml={2}
                            textTransform="uppercase"
                            backgroundColor="#000000"
                            border={1}
                            color="#ffffff"
                            borderColor="#000000"
                            width="20%"
                            textAlign="center"
                            borderRadius="8px 0px 0px 8px"
                          >
                            reset
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={750}
                            p={0.5}
                            border={1}
                            borderColor="#000000"
                            textTransform="uppercase"
                            backgroundColor="#f8bf60"
                            color="#ffffff"
                            width="25%"
                            textAlign="center"
                          >
                            increase
                          </Typography>
                          <Box
                            width="55%"
                            mr={2}
                            pt={0.5}
                            backgroundColor="#ffffff"
                            borderRadius="0px 8px 8px 0px"
                            border={1}
                            borderColor="#fcdfb0"
                            sx={{ display: 'flex', direction: 'row', justifyContent: 'center', alignItems: 'center' }}
                          >
                            <Typography
                              fontSize={16}
                              fontWeight={700}
                              width="90%"
                              textAlign="center"
                            >
                              100
                            </Typography>
                            <Typography
                              pr={0.5}
                            >
                              <PercentIcon sx={{ fontSize: 20 }} />
                            </Typography>
                          </Box>
                        </Box>
                      </Stack> :
                      ''
                  }


                  {
                    autoplay ?
                      <Stack
                        borderRadius="10px 10px 0px 0px"
                        backgroundColor="#f8bf60"
                        borderBottom="2px solid black"
                        sx={{ position: 'absolute', zIndex: 1000, bottom: 100, width: '100%' }}
                      >
                        <Box
                          sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}
                        >
                          <Box
                            margin={2}
                          >
                            <Typography
                              textTransform="uppercase"
                              fontSize={14}
                              fontWeight={900}
                            >
                              autoplay
                            </Typography>
                            <Typography
                              textTransform="uppercase"
                              fontSize={10}
                              fontWeight={900}
                            >
                              number of rounds
                            </Typography>
                          </Box>
                          <Box
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            margin={2}
                            sx={{ display: 'flex', direction: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                          >
                            <Button
                              variant="text"
                            >
                              <Typography
                                textTransform="uppercase"
                                fontSize={14}
                                fontWeight={700}
                                pl={1}
                                color="#000000"
                                onClick={openAdvancedAutoplay}
                              >
                                advanced
                              </Typography>
                              <KeyboardArrowUpIcon />
                            </Button>
                          </Box>
                        </Box>
                        <Box
                          textAlign="center"
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            ml={2}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            10
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            25
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            50
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            mr={2}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            75
                          </Typography>
                        </Box>
                        <Box
                          mt={1}
                          mb={2}
                          textAlign="center"
                          sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            ml={2}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            100
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            500
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={700}
                            padding={0.5}
                            pl={1}
                            pr={1}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            1,000
                          </Typography>
                          <Typography
                            fontWeight={700}
                            padding={0.5}
                            fontSize={14}
                            pl={1}
                            pr={1}
                            mr={2}
                            backgroundColor="#ffffff"
                            borderRadius={2}
                            width="15%"
                          >
                            <AllInclusiveIcon sx={{ fontSize: 14 }} />
                          </Typography>
                        </Box>
                      </Stack> :
                      ''
                  }

                  <ButtonGroup fullWidth sx={{ height: 65 }}>
                    <MainButton
                      sx={{
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "Montserrat",
                        textTransform: 'uppercase',
                        width: '25%',
                        lineHeight: 1.5,
                        margin: 0,
                        borderRadius: 0
                      }}
                    >
                      Max bet
                    </MainButton>

                    <MainButton
                      sx={{
                        fontSize: 36,
                        fontWeight: 800,
                        fontFamily: "Montserrat",
                        textTransform: 'uppercase',
                        color: 'black',
                        width: '50%',
                        borderLeft: '2px solid black',
                        '&:hover': {
                          borderLeft: '2px solid black'
                        }
                      }}
                      onClick={startGame}
                    >
                      {
                        (autoplay || advancedAutoplay) ?
                          'Start'
                          :
                          'play'
                      }
                    </MainButton>

                    <MainButton
                      sx={{
                        color: 'black',
                        width: '25%',
                        borderLeft: '2px solid black',
                        '&:hover': {
                          borderLeft: '2px solid black'
                        }
                      }}>
                      {
                        (autoplay || advancedAutoplay) ?
                          <Icon icon="mdi:close-thick" onClick={closehandleAutoplay} height="36" />
                          :
                          <ReplayIcon onClick={openhandleAutoplay} sx={{ fontSize: 36, fontWeight: 900 }} />
                      }
                    </MainButton>
                  </ButtonGroup>

                  <Box fullWidth>
                    <Grid container columns={2} spacing={0.5}>
                      <Grid item md={1}>
                        <BlackButton sx={{ color: 'white', fontWeight: 800, fontSize: 9, fontFamily: "Montserrat" }} fullWidth>
                          Activate bet-list
                        </BlackButton>
                      </Grid>

                      <Grid item md={1}>
                        <BlackButton onClick={openBetListModal} sx={{ color: 'white', fontWeight: 800, fontSize: 9, fontFamily: "Montserrat" }} fullWidth>
                          <Typography
                            component="span"
                            fontSize="inherit"
                            fontWeight="inherit"
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          >
                            View bet-list (total: <DiamondIcon sx={{ fontSize: 9 }} className="text-yellow" /> 5.00)
                          </Typography>
                        </BlackButton>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={3} md={1}>
                <RightSlider payout={payout} setPayout={setPayout} />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Stack >
      <BetListModal />
      <GameInfoModal />
      <BetInfoModal />
    </Stack>
  );
}