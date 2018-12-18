extern "C" double setXposition(double wx, double ox)
{
    if (wx / 2.0 - ox < 1e-05)
        return ox;
    return wx / 2.0 - ox;
}
