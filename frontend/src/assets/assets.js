import add_icon_green from './add_icon_green.png';
import add_icon_white from './add_icon_white.png';
import app_store from './app_store.png';
import play_store from './play_store.png';
import basket_icon from './basket_icon.png';
import bg_img from './bg.jpg';
import bag from './bag_icon.png';
import facebook_icon from './facebook_icon.png';
import twitter_icon from './twitter_icon.png';
import cross_icon from './cross_icon.png';
import search_icon from './search_icon.png';
import selector_icon from './selector_icon.png';
import profile_icon from './profile_icon.png';
import logout_icon from './logout_icon.png';
import parcel_icon from './parcel_icon.png';
import rating_starts from './rating_starts.png';
import shree_kitchen_logo from './shree kitchen logo.jpg';
import sk_logo from './sk_logo.png';
import remove_icon_red from './remove_icon_red.png';
import fb from './facebook.png';
import instagram from './instagram.png';
import youtube from './youtube.png';
import whatsapp from './whatsapp.png'

// Food images
import aloo from './aloo paratha.jpeg'
import choorma from './choormaladoo.jpg';
import daaldhokli from './daaldhokli.jpg';
import dabeli from './dabeli.jpg';
import bhakri from './bhakri.png';
import cheese_dabeli from './cheese dabeli.jpeg';
import cheese_pav_bhaji from './cheese pav bhaji.jpg';
import chole from './chole.jpeg';
import chorafali from './chorafali.jpg';
import ghee_sada_khakhra from './ghee sada khakhra.jpg';
import godpapdi from './god papdi.jpg';
import katka from './katka.jpg';
import kd from './kd.jpg';
import khajurpaak from './khajurpaak.jpg';
import khaman_dhokla from './Khaman-Dhokla.jpg';
import khamani from './khamani.jpg';
import khandvi from './khandvi.jpg';
import makhana from './makhana.jpg';
import malai_roll from './malai roll.jpg';
import methi_khakhra from './methi khakahra.webp';
import mini_appam from './mini appam.jpeg';
import misal from './misal.webp';
import muthiya from './muthiya.jpg';
import pav_bhaji from './pav bhaji.jpg';
import poha from './poha.jpg';
import pulao from './pulao.jpg';
import sabudana from './sabudana.jpg';
import sandwich from './sandwich.jpg';
import sweets from './sweets.jpg';
import thepla from './thepla.jpg';
import tiffin from './tiffin.jpg';
import toast_sandwich from './toast sandwich.jpg';
import undhiyu from './undhiyu.jpg';
import undhiyu1 from './undhiyu1.jpg';
import upma from './upma.jpeg';
import vada_pav from './Vada-Pav.jpg';
import whitedhokla from './whitedhokla.jpg';

export const assets = {
  bg_img,
  add_icon_green,
  add_icon_white,
  app_store,
  play_store,
  basket_icon,
  facebook_icon,
  twitter_icon,
  cross_icon,
  search_icon,
  selector_icon,
  profile_icon,
  logout_icon,
  parcel_icon,
  rating_starts,
  remove_icon_red,
  sk_logo,
  fb,
  instagram,
  whatsapp,
  youtube,
  bag
};

export const menu_list = [
  {
    menu_name: "Snacks",
    menu_image: dabeli
  },
  {
    menu_name: "Main Course",
    menu_image: pav_bhaji
  },
  {
    menu_name: "Breakfast",
    menu_image: poha
  },
  {
    menu_name: "Breads & Parathas",
    menu_image: aloo
  },
  {
    menu_name: "Rice & Pulao",
    menu_image: pulao
  },
  {
    menu_name: "Sweets",
    menu_image: sweets
  }
];

export const food_list = [
  {
    _id: "1",
    name: "Choorma Ladoo",
    image: choorma,
    price: 15,
    description: "A sweet dish made from wheat flour and jaggery.",
    category: "Sweets"
  },
  {
    _id: "2",
    name: "Daal Dhokli",
    image: daaldhokli,
    price: 18,
    description: "A traditional Gujarati dish with lentils and wheat flour noodles.",
    category: "Main Course"
  },
  {
    _id: "3",
    name: "Dabeli",
    image: dabeli,
    price: 12,
    description: "Spicy and tangy potato filling stuffed in pav (bread).",
    category: "Snacks"
  },
  {
    _id: "4",
    name: "Bhakri",
    image: bhakri,
    price: 10,
    description: "A traditional Indian flatbread made from wheat flour.",
    category: "Breads & Parathas"
  },
  {
    _id: "5",
    name: "Cheese Dabeli",
    image: cheese_dabeli,
    price: 16,
    description: "Dabeli with a cheesy twist, stuffed with a spicy potato filling.",
    category: "Snacks"
  },
  {
    _id: "6",
    name: "Chole Bhature",
    image: chole,
    price: 20,
    description: "Spicy chickpea curry served with rice or flatbread.",
    category: "Main Course"
  },
  {
    _id: "7",
    name: "Chorafali",
    image: chorafali,
    price: 14,
    description: "Crunchy deep-fried snack made from chickpea flour.",
    category: "Snacks"
  },
  {
    _id: "8",
    name: "Ghee Sada Khakhra",
    image: ghee_sada_khakhra,
    price: 10,
    description: "Crunchy Indian snack made from wheat flour, roasted with ghee.",
    category: "Snacks"
  },
  {
    _id: "9",
    name: "God Papdi",
    image: godpapdi,
    price: 12,
    description: "Sweet, crunchy snack made from jaggery and sesame seeds.",
    category: "Sweets"
  },
  {
    _id: "10",
    name: "Katka",
    image: katka,
    price: 18,
    description: "A sweet treat made from jaggery and sesame seeds.",
    category: "Snacks"
  },
  {
    _id: "11",
    name: "Kutchi Dabeli",
    image: kd,
    price: 12,
    description: "A sweet and savory snack made from gram flour and spices.",
    category: "Snacks"
  },
  {
    _id: "12",
    name: "Khajur Paak",
    image: khajurpaak,
    price: 10,
    description: "Sweet dessert made from dates and nuts, often served during festivals.",
    category: "Sweets"
  },
  {
    _id: "13",
    name: "Khaman Dhokla",
    image: khaman_dhokla,
    price: 12,
    description: "A spongy, savory steamed cake made from chickpea flour.",
    category: "Snacks"
  },
  {
    _id: "14",
    name: "Sev Khamani",
    image: khamani,
    price: 14,
    description: "A savory snack made from chickpea flour, spongy and delicious.",
    category: "Snacks"
  },
  {
    _id: "15",
    name: "Khandvi",
    image: khandvi,
    price: 16,
    description: "Savory snack made from gram flour, rolled into thin layers.",
    category: "Snacks"
  },
  {
    _id: "16",
    name: "Makhana Ladoo",
    image: makhana,
    price: 10,
    description: "A crunchy, healthy ladoos made from roasted fox nuts.",
    category: "Sweets"
  },
  {
    _id: "17",
    name: "Malai Roll",
    image: malai_roll,
    price: 15,
    description: "A delicious roll with sweet malai (cream) filling.",
    category: "Sweets"
  },
  {
    _id: "18",
    name: "Methi Khakhra",
    image: methi_khakhra,
    price: 14,
    description: "A crunchy, fenugreek-flavored Indian flatbread.",
    category: "Breads & Parathas"
  },
  {
    _id: "19",
    name: "Mini Appam",
    image: mini_appam,
    price: 16,
    description: "Small, spongy pancakes served with chutney.",
    category: "Breakfast"
  },
  {
    _id: "20",
    name: "Misal Pav",
    image: misal,
    price: 18,
    description: "A spicy curry made from sprouted lentils, served with pav (bread).",
    category: "Main Course"
  },
  {
    _id: "21",
    name: "Muthiya",
    image: muthiya,
    price: 15,
    description: "Steamed savory dumplings made from chickpea flour and vegetables.",
    category: "Snacks"
  },
  {
    _id: "22",
    name: "Pav Bhaji",
    image: pav_bhaji,
    price: 18,
    description: "Spicy mashed vegetable curry served with buttered pav (bread).",
    category: "Snacks"
  },
  {
    _id: "23",
    name: "Poha",
    image: poha,
    price: 12,
    description: "A light and healthy dish made from flattened rice, peanuts, and spices.",
    category: "Breakfast"
  },
  {
    _id: "24",
    name: "Pulao",
    image: pulao,
    price: 16,
    description: "Fragrant rice dish cooked with vegetables and spices.",
    category: "Rice & Pulao"
  },
  {
    _id: "25",
    name: "Sabudana Khichdi",
    image: sabudana,
    price: 14,
    description: "A savory dish made from tapioca pearls, peanuts, and spices.",
    category: "Breakfast"
  },
  {
    _id: "26",
    name: "Sandwich",
    image: sandwich,
    price: 12,
    description: "Simple sandwich filled with vegetables or cheese.",
    category: "Snacks"
  },
  {
    _id: "27",
    name: "Sweets",
    image: sweets,
    price: 10,
    description: "Assorted traditional Indian sweets.",
    category: "Desserts"
  },
  {
    _id: "28",
    name: "Thepla",
    image: thepla,
    price: 15,
    description: "Spicy flatbread made from whole wheat flour and fenugreek.",
    category: "Breads & Parathas"
  },
  {
    _id: "29",
    name: "Tiffin",
    image: tiffin,
    price: 20,
    description: "A wholesome meal in a tiffin box with multiple dishes.",
    category: "Main Course"
  },
  {
    _id: "30",
    name: "Toast Sandwich",
    image: toast_sandwich,
    price: 10,
    description: "Crispy toast with a filling of vegetables or cheese.",
    category: "Snacks"
  },
  {
    _id: "31",
    name: "Undhiyu",
    image: undhiyu,
    price: 22,
    description: "A mixed vegetable dish cooked in traditional Gujarati style.",
    category: "Main Course"
  },
  {
    _id: "32",
    name: "Undhiyu (Alternate)",
    image: undhiyu1,
    price: 22,
    description: "Another version of the classic Undhiyu dish.",
    category: "Main Course"
  },
  {
    _id: "33",
    name: "Upma",
    image: upma,
    price: 12,
    description: "A savory breakfast dish made from semolina.",
    category: "Breakfast"
  },
  {
    _id: "34",
    name: "Vada Pav",
    image: vada_pav,
    price: 16,
    description: "A spicy potato fritter served in a pav (bread).",
    category: "Snacks"
  },
  {
    _id: "35",
    name: "White Dhokla",
    image: whitedhokla,
    price: 15,
    description: "Steamed savory cake made from fermented rice and chickpea flour.",
    category: "Snacks"
  },
  {
    _id: "36",
    name: "Cheese Pav Bhaji",
    image: cheese_pav_bhaji,
    price: 15,
    description: "Steamed savory cake made from fermented rice and chickpea flour.",
    category: "Snacks"
  }
];





