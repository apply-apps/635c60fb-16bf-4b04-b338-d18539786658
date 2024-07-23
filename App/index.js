// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');
const CELL_SIZE = 20;
const BOARD_WIDTH = Math.floor(width / CELL_SIZE) * CELL_SIZE;
const BOARD_HEIGHT = Math.floor(height / CELL_SIZE) * CELL_SIZE;

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

let snakeInterval;

const initSnake = [{ x: 4, y: 4 }];

const getRandomFoodPosition = () => {
  return {
    x: Math.floor(Math.random() * BOARD_WIDTH / CELL_SIZE),
    y: Math.floor(Math.random() * BOARD_HEIGHT / CELL_SIZE),
  };
};

const App = () => {
  const [snake, setSnake] = useState(initSnake);
  const [food, setFood] = useState(getRandomFoodPosition());
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (snakeInterval) {
      clearInterval(snakeInterval);
    }
    if (!isGameOver) {
      snakeInterval = setInterval(() => {
        moveSnake();
      }, 100);
    } else {
      clearInterval(snakeInterval);
    }
    return () => clearInterval(snakeInterval);
  }, [snake, direction, isGameOver]);

  const moveSnake = useCallback(() => {
    const newSnake = Array.from(snake);
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;

    if (
      head.x >= BOARD_WIDTH / CELL_SIZE ||
      head.x < 0 ||
      head.y >= BOARD_HEIGHT / CELL_SIZE ||
      head.y < 0 ||
      newSnake.some(part => part.x === head.x && part.y === head.y)
    ) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomFoodPosition());
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, score]);

  const handleTouch = (dx, dy) => {
    // Capturing swipe directions to change the direction of the snake
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && direction !== DIRECTIONS.LEFT) {
        setDirection(DIRECTIONS.RIGHT);
      } else if (dx < 0 && direction !== DIRECTIONS.RIGHT) {
        setDirection(DIRECTIONS.LEFT);
      }
    } else {
      if (dy > 0 && direction !== DIRECTIONS.UP) {
        setDirection(DIRECTIONS.DOWN);
      } else if (dy < 0 && direction !== DIRECTIONS.DOWN) {
        setDirection(DIRECTIONS.UP);
      }
    }
  };

  const resetGame = () => {
    setSnake(initSnake);
    setFood(getRandomFoodPosition());
    setDirection(DIRECTIONS.RIGHT);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Snake Game</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <View style={styles.board}>
        {snake.map((s, index) => (
          <View key={index} style={[styles.snake, { left: s.x * CELL_SIZE, top: s.y * CELL_SIZE }]} />
        ))}
        <View style={[styles.food, { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE }]} />
      </View>
      {isGameOver && (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Button title="Restart" onPress={resetGame} />
        </View>
      )}
      {!isGameOver && (
        <View style={styles.controlContainer}>
          <TouchableOpacity onPress={() => handleTouch(-1, 0)} style={styles.controlButton} />
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={() => handleTouch(0, -1)} style={styles.controlButton} />
            <TouchableOpacity onPress={() => handleTouch(0, 1)} style={styles.controlButton} />
          </View>
          <TouchableOpacity onPress={() => handleTouch(1, 0)} style={styles.controlButton} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    backgroundColor: '#c0c0c0',
    position: 'relative',
    alignSelf: 'center',
  },
  snake: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#000',
    position: 'absolute',
  },
  food: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#f00',
    position: 'absolute',
  },
  gameOver: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  controlContainer: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007BFF',
    marginHorizontal: 20,
    borderRadius: 25,
  },
});

export default App;