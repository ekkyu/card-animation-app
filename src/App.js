import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  BottomNavigation,
  BottomNavigationAction as MuiBottomNavigationAction,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const MotionBottomNavigationAction = motion(MuiBottomNavigationAction);

function SaveCard({ id, onSave }) {
  const cardRef = useRef();

  const handleClick = () => {
    const rect = cardRef.current.getBoundingClientRect();
    onSave(id, rect);
  };

  return (
    <Card ref={cardRef} elevation={3} sx={{ position: "relative" }}>
      <CardContent>
        <Typography variant="h6">カード {id}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{ mt: 2 }}
        >
          保存
        </Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [cards, setCards] = useState([1, 2, 3]);
  const [flyingCard, setFlyingCard] = useState(null);
  const saveIconRef = useRef();
  const [savePulse, setSavePulse] = useState(false);

  const handleSave = (id, rect) => {
    const iconRect = saveIconRef.current?.getBoundingClientRect();
    if (!iconRect) return;

    setFlyingCard({
      id,
      from: rect,
      to: iconRect,
    });

    setSavePulse(true);
    setTimeout(() => setSavePulse(false), 400);

    setTimeout(() => {
      setCards((prev) => prev.filter((c) => c !== id));
      setFlyingCard(null);
    }, 600);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        pb: 10,
      }}
    >
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Grid container spacing={3}>
          {cards.map((id) => (
            <Grid item xs={12} md={4} key={id}>
              <SaveCard id={id} onSave={handleSave} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 飛ぶカード */}
      <AnimatePresence>
        {flyingCard && (
          <motion.div
            initial={{
              position: "fixed",
              top: flyingCard.from.top,
              left: flyingCard.from.left,
              width: flyingCard.from.width,
              height: flyingCard.from.height,
              scale: 1,
            }}
            animate={{
              top: flyingCard.to.top - 10,
              left: flyingCard.to.left - 10,
              width: flyingCard.to.width,
              height: flyingCard.to.height,
              scale: 0.3,
              opacity: 0.4,
              rotate: 10,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              filter: "blur(1px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">カード {flyingCard.id}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ナビゲーションバー */}
      <BottomNavigation
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
          zIndex: 1000,
          px: 1,
        }}
      >
        <MuiBottomNavigationAction label="ホーム" icon={<HomeIcon />} />
        <MuiBottomNavigationAction label="レコメンド" icon={<SearchIcon />} />
        <MuiBottomNavigationAction
          label="投稿"
          icon={<AddCircleOutlineIcon />}
        />

        <MotionBottomNavigationAction
          label="リスト"
          icon={<BookmarkBorderIcon />}
          ref={saveIconRef}
          animate={savePulse ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4 }}
        />

        <MuiBottomNavigationAction
          label="マイページ"
          icon={<AccountCircleIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
