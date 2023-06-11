<script>
export default {
  name: "TheNavbar",

  data() {
    return {
      listNavbar: [
        {
          title: this.$MISAResource.Navbar.HomeNav.Overview.title,
          tooltip: this.$MISAResource.Navbar.HomeNav.Overview.tooltip,
          link: "/",
          classIcon: "navbar__item-overview-icon",
        },
        {
          title: this.$MISAResource.Navbar.HomeNav.Employee.title,
          tooltip: this.$MISAResource.Navbar.HomeNav.Employee.tooltip,
          link: "/employee",
          classIcon: "navbar__item-employee-icon",
        },
        {
          title: this.$MISAResource.Navbar.HomeNav.Customer.title,
          tooltip: this.$MISAResource.Navbar.HomeNav.Customer.tooltip,
          link: "/customer",
          classIcon: "navbar__item-customer-icon",
        },
        {
          title: this.$MISAResource.Navbar.HomeNav.Appoint.title,
          tooltip: this.$MISAResource.Navbar.HomeNav.Appoint.tooltip,
          link: "/appoint",
          classIcon: "navbar__item-overview-icon",
        },
        {
          title: this.$MISAResource.Navbar.HomeNav.File.title,
          tooltip: this.$MISAResource.Navbar.HomeNav.File.tooltip,
          link: "/file",
          classIcon: "navbar__item-profile-icon",
        },
        {
          title: this.$MISAResource.Navbar.HomeNav.Bonus.title,
          tooltip: this.$MISAResource.Navbar.HomeNav.Bonus.tooltip,
          link: "/bonus",
          classIcon: "navbar__item-bonus-icon",
        },
        {
          title: this.$MISAResource.Navbar.HomeNav.Problem.title,
          tooltip: this.$MISAResource.Navbar.HomeNav.Problem.tooltip,
          link: "/problem",
          classIcon: "navbar__item-problem-icon",
        },
        {
          title: this.$MISAResource.Navbar.HomeNav.Zoning.title,
          tooltip: this.$MISAResource.Navbar.HomeNav.Zoning.tooltip,
          link: "/zoning",
          classIcon: "navbar__item-zoning-icon",
        },
        {
          title: this.$MISAResource.Navbar.HomeNav.Report.title,
          tooltip: this.$MISAResource.Navbar.HomeNav.Report.tooltip,
          link: "/report",
          classIcon: "navbar__item-report-icon",
        },
      ],
    };
  },
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
      <router-link
        v-for="item in this.listNavbar"
        :to="item.link"
        class="navbar__item-overview"
      >
        <div :class="item.classIcon" :title="item.tooltip"></div>
        <div class="navbar__item-title">{{ item.title }}</div>
      </router-link>

      <!-- <div class="navbar__item-overview">
        <div class="navbar__item-overview-icon"></div>
        <div class="navbar__item-title">Tổng quan</div>
      </div>

      <router-link to="/employee" class="navbar__item-overview">
        <div class="navbar__item-price-icon"></div>
        <div class="navbar__item-title">Nhân viên</div>
      </router-link>

      <router-link to="/customer" class="navbar__item-overview">
        <div class="navbar__item-shopping-icon"></div>
        <div class="navbar__item-title">Khách hàng</div>
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
      </div> -->
    </div>
    <!-- Navbar information -- End-- -->
  </div>
</template>

<style lang="scss" scoped></style>
