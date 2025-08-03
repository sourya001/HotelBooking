// Get/api/user

export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchCities = req.user.recentSearchCities;
    res.json({
      success: true,
      role,
      recentSearchCities,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// store user recent search cities
export const storeRecentSearchCities = async (req, res) => {
  try {
    const { recentSearchCity } = req.body;
    const user = await req.user;

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchCity);
    } else {
      user.recentSearchedCities.shift(); // Remove the oldest city
      user.recentSearchedCities.push(recentSearchCity); // Add the new city
    }
    await user.save();
    res.json({
      success: true,
      message: "Recent search city updated successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
