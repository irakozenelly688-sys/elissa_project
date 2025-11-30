-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2025 at 09:38 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gym_rentals`
--

-- --------------------------------------------------------

--
-- Table structure for table `rentals`
--

CREATE TABLE `rentals` (
  `id` int(11) NOT NULL,
  `tool_id` int(11) NOT NULL,
  `renter_name` varchar(255) NOT NULL,
  `renter_contact` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','returned','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rentals`
--

INSERT INTO `rentals` (`id`, `tool_id`, `renter_name`, `renter_contact`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(1, 1, 'irene', '0796014437', '2025-01-01', '2025-11-26', 'active', '2025-11-26 17:03:55'),
(2, 5, 'elissa', '0796014437', '2025-11-14', '2025-11-15', 'active', '2025-11-26 17:20:16'),
(3, 4, 'elissa', '0796014437', '2025-11-13', '2025-11-12', 'active', '2025-11-26 17:26:40'),
(4, 3, 'josiane', '0796014437', '2025-11-12', '2025-11-14', 'active', '2025-11-27 08:38:56');

-- --------------------------------------------------------

--
-- Table structure for table `tools`
--

CREATE TABLE `tools` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `condition` varchar(100) DEFAULT 'good',
  `price_per_day` decimal(8,2) DEFAULT 0.00,
  `image_path` varchar(255) DEFAULT 'images/placeholder.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tools`
--

INSERT INTO `tools` (`id`, `name`, `category`, `quantity`, `condition`, `price_per_day`, `image_path`) VALUES
(1, 'Dumbbell 10kg', 'Weights', 4, 'good', '2.00', 'images/dumbbell.jpg'),
(2, 'Yoga Mat', 'Accessories', 10, 'good', '1.00', 'images/yogamat.jpg'),
(3, 'Kettlebell 16kg', 'Weights', 2, 'good', '3.00', 'images/kettlebell.jpg'),
(4, 'Dumbbell 10kg', 'Weights', 4, 'good', '2.00', 'images/dumbbell.jpg'),
(5, 'Yoga Mat', 'Accessories', 9, 'good', '1.00', 'images/yogamat.jpg'),
(6, 'Kettlebell 16kg', 'Weights', 3, 'good', '3.00', 'images/kettlebell.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tool_id` (`tool_id`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
