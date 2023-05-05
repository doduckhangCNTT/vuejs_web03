<script>
export default {
  name: "TheNavbar",
};
</script>

<template>
  <div class="navbar">
    <div class="navbar__header">
      <div class="navbar__header-icon">
        <div class="navbar__header-icon-sprite"></div>
      </div>
      <div class="navbar__header-logo">
        <div class="sprite-logo"></div>
        <span class="">KẾ TOÁN</span>
      </div>
    </div>

    <!-- Navbar information -- Start-- -->
    <div class="navbar__items">
      <div class="navbar__item-overview">
        <div class="navbar__item-overview-icon"></div>
        <div class="navbar__item-title">Tổng quan</div>
      </div>

      <router-link to="/employee" class="navbar__item-overview">
        <div class="navbar__item-price-icon"></div>
        <div class="navbar__item-title">Employee</div>
      </router-link>

      <router-link to="/customer" class="navbar__item-overview">
        <div class="navbar__item-shopping-icon"></div>
        <div class="navbar__item-title">Customer</div>
      </router-link>
      <div class="navbar__item-overview">
        <div class="navbar__item-overview-icon"></div>
        <div class="navbar__item-title">Tổng quan</div>
      </div>

      <div class="navbar__item-overview">
        <div class="navbar__item-price-icon"></div>
        <div class="navbar__item-title">Tiền mặt</div>
      </div>

      <div class="navbar__item-overview">
        <div class="navbar__item-shopping-icon"></div>
        <div class="navbar__item-title">Mua hàng</div>
      </div>
      <div class="navbar__item-overview">
        <div class="navbar__item-overview-icon"></div>
        <div class="navbar__item-title">Tổng quan</div>
      </div>

      <div class="navbar__item-overview">
        <div class="navbar__item-price-icon"></div>
        <div class="navbar__item-title">Tiền mặt</div>
      </div>

      <div class="navbar__item-overview">
        <div class="navbar__item-shopping-icon"></div>
        <div class="navbar__item-title">Mua hàng</div>
      </div>
    </div>
    <!-- Navbar information -- End-- -->
  </div>
</template>

<style lang="scss" scoped></style>
